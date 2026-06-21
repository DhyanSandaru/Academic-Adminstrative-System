// server/controllers/BackupController.js
const db = require("../DBconfig.js");
const { database } = require("../firebaseAdmin.js");

// Helper: get primary key columns for a table
const getPrimaryKeyColumns = async (tableName) => {
  const [pkRows] = await db.query(
    `SELECT column_name FROM information_schema.key_column_usage WHERE table_schema = DATABASE() AND table_name = ? AND constraint_name = 'PRIMARY' ORDER BY ordinal_position`,
    [tableName]
  );
  return pkRows.map((r) => r.column_name);
};

// Helper: create stable key for row by primary key(s)
const getRowKey = (row, pkColumns) => {
  if (pkColumns.length === 0) {
    if (row.id != null) return String(row.id);
    return String(row._id || row.ref_no || Date.now() + Math.random());
  }

  const keyParts = pkColumns.map((pk) => {
    const val = row[pk];
    return val != null ? String(val) : "null";
  });
  return keyParts.join("_");
};

// Helper: set row into latest backup path
const setBackupRow = async (tableName, row, pkColumns) => {
  const rowKey = getRowKey(row, pkColumns);
  await database.ref(`backups/latest/${tableName}/${rowKey}`).set(row);
  return rowKey;
};

// Helper: remove row from latest backup path
const removeBackupRow = async (tableName, row, pkColumns) => {
  const rowKey = getRowKey(row, pkColumns);
  await database.ref(`backups/latest/${tableName}/${rowKey}`).remove();
  return rowKey;
};

/**
 * Create a new backup
 * POST /api/backup/create
 */
const sanitizeRow = (row) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(row)) {
    if (value instanceof Date) {
      sanitized[key] = value.toISOString();
    } else if (value === null) {
      sanitized[key] = null;
    } else if (Buffer.isBuffer(value)) {
      sanitized[key] = value.toString('base64');
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

exports.backupToFirebase = async (req, res) => {
  const { excludeTable } = req.body;
  const backupId = `backup_${Date.now()}`;
  const backupMetadata = {
    timestamp: new Date().toISOString(),
    status: "in_progress",
    tables: {},
    errors: []
  };

  try {
    console.log(`🔄 Starting incremental backup: ${backupId}`);

    // Get last backup marker (if exists)
    const lastBackupSnapshot = await database.ref('backups/latest/metadata/lastBackupAt').once('value');
    const lastBackupAt = lastBackupSnapshot.val() || null;

    // Get all table names
    const [tables] = await db.query(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = DATABASE()`
    );

    for (const t of tables) {
      const tableName = t.table_name || t.TABLE_NAME;
      if (tableName === excludeTable) {
        console.log(`⏭️  Skipping table: ${tableName}`);
        continue;
      }

      try {
        const [updatedAtColumn] = await db.query(
          `SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = 'updated_at'`,
          [tableName]
        );

        let query = `SELECT * FROM \`${tableName}\``;
        let params = [];

        if (updatedAtColumn.length && lastBackupAt) {
          query = `SELECT * FROM \`${tableName}\` WHERE updated_at > ?`;
          params = [lastBackupAt];
        }

        const [rows] = await db.query(query, params);
        const pkColumns = await getPrimaryKeyColumns(tableName);

        let rowsProcessed = 0;

        for (const row of rows) {
          const sanitized = sanitizeRow(row);
          await setBackupRow(tableName, sanitized, pkColumns);
          rowsProcessed += 1;
        }

        backupMetadata.tables[tableName] = {
          rowCount: rowsProcessed,
          status: "success"
        };

        console.log(`✅ Table "${tableName}" incremental synced (${rowsProcessed} rows)`);
      } catch (tableError) {
        console.error(`❌ Error backing up table "${tableName}":`, tableError);
        backupMetadata.errors.push({
          table: tableName,
          error: tableError.message
        });
        backupMetadata.tables[tableName] = {
          status: "failed",
          error: tableError.message
        };
      }
    }

    // Finalize metadata and pointer
    backupMetadata.status = backupMetadata.errors.length === 0 ? "completed" : "completed_with_errors";
    backupMetadata.lastBackupAt = new Date().toISOString();

    await database.ref(`backups/latest/metadata`).set(backupMetadata);
    await database.ref(`backups/${backupId}/metadata`).set(backupMetadata);
    await database.ref('latest_backup').set({
      backupId,
      timestamp: backupMetadata.lastBackupAt,
      status: backupMetadata.status
    });

    console.log(`✅ Backup completed: ${backupId}`);

    res.status(200).json({
      success: true,
      message: "Backup synced successfully",
      backupId,
      metadata: backupMetadata
    });

  } catch (err) {
    console.error("❌ Backup failed:", err);
    
    // Store failed backup info
    backupMetadata.status = "failed";
    backupMetadata.errors.push({
      type: "system",
      error: err.message
    });
    
    try {
      await database.ref(`backups/${backupId}/metadata`).set(backupMetadata);
    } catch (metaError) {
      console.error("Failed to save error metadata:", metaError);
    }

    res.status(500).json({
      success: false,
      message: "Backup failed",
      backupId,
      error: err.message,
      metadata: backupMetadata
    });
  }
};

/**
 * Sync a single row change into the latest backup.
 * POST /api/backup/sync-row
 * Body: { tableName, row, operation: 'upsert' | 'delete' }
 */
exports.syncRowToFirebase = async (req, res) => {
  try {
    const { tableName, row, operation } = req.body;

    if (!tableName || !row || !operation) {
      return res.status(400).json({ success: false, message: 'tableName, row, and operation are required' });
    }

    const pkColumns = await getPrimaryKeyColumns(tableName);

    if (operation === 'delete') {
      await removeBackupRow(tableName, row, pkColumns);
      return res.status(200).json({ success: true, message: 'Row deleted from latest backup' });
    }

    if (operation === 'upsert') {
      await setBackupRow(tableName, sanitizeRow(row), pkColumns);
      return res.status(200).json({ success: true, message: 'Row upserted into latest backup' });
    }

    return res.status(400).json({ success: false, message: 'Invalid operation. Use upsert or delete' });
  } catch (err) {
    console.error('Failed to sync row to Firebase:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Restore from most recent incremental backup
 * POST /api/backup/restore/latest
 */
exports.restoreFromLatest = async (req, res) => {
  try {
    console.log('🔄 Starting restore from latest backup data');

    const backupSnapshot = await database.ref('backups/latest').once('value');
    const backupData = backupSnapshot.val();

    if (!backupData) {
      return res.status(404).json({ success: false, message: 'No latest backup data found' });
    }

    const restoreResults = { timestamp: new Date().toISOString(), tables: {}, errors: [] };

    for (const [tableName, rows] of Object.entries(backupData)) {
      if (tableName === 'metadata') continue;

      try {
        await db.query(`DELETE FROM \`${tableName}\``);

        let rowArray = [];
        if (Array.isArray(rows)) { rowArray = rows; }
        else if (rows && typeof rows === 'object') { rowArray = Object.values(rows); }

        for (const row of rowArray) {
          const columns = Object.keys(row).join(', ');
          const placeholders = Object.keys(row).map(() => '?').join(', ');
          const values = Object.values(row);

          await db.query(`INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`, values);
        }

        restoreResults.tables[tableName] = { rowCount: rowArray.length, status: 'success' };
        console.log(`✅ Table "${tableName}" restored (${rowArray.length} rows)`);
      } catch (tableError) {
        console.error(`❌ Error restoring table "${tableName}":`, tableError);
        restoreResults.errors.push({ table: tableName, error: tableError.message });
        restoreResults.tables[tableName] = { status: 'failed', error: tableError.message };
      }
    }

    console.log('✅ Restore completed from latest');
    return res.status(200).json({ success: true, message: 'Restore completed successfully', results: restoreResults });
  } catch (err) {
    console.error('❌ Restore latest failed:', err);
    return res.status(500).json({ success: false, message: 'Restore latest failed', error: err.message });
  }
};

/**
 * Restore from a backup
 * POST /api/backup/restore/:backupId
 */
exports.restoreFromFirebase = async (req, res) => {
  const { backupId } = req.params;

  try {
    console.log(`🔄 Starting restore from: ${backupId}`);

    // Get backup data
    const backupSnapshot = await database.ref(`backups/${backupId}`).once('value');
    const backupData = backupSnapshot.val();

    if (!backupData) {
      return res.status(404).json({
        success: false,
        message: `Backup ${backupId} not found`
      });
    }

    const restoreResults = {
      timestamp: new Date().toISOString(),
      tables: {},
      errors: []
    };

    // Restore each table
    for (const [tableName, rows] of Object.entries(backupData)) {
      if (tableName === 'metadata') continue;

      try {
        // Clear existing data
        await db.query(`DELETE FROM \`${tableName}\``);

        // Insert backup data
        let rowArray = [];

        if (Array.isArray(rows)) {
          rowArray = rows;
        } else if (rows && typeof rows === 'object') {
          rowArray = Object.values(rows);
        }

        if (rowArray.length > 0) {
          for (const row of rowArray) {
            const columns = Object.keys(row).join(', ');
            const placeholders = Object.keys(row).map(() => '?').join(', ');
            const values = Object.values(row);

            await db.query(
              `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`,
              values
            );
          }
        }

        restoreResults.tables[tableName] = {
          rowCount: rowArray.length,
          status: "success"
        };

        console.log(`✅ Table "${tableName}" restored (${rows.length} rows)`);
      } catch (tableError) {
        console.error(`❌ Error restoring table "${tableName}":`, tableError);
        restoreResults.errors.push({
          table: tableName,
          error: tableError.message
        });
        restoreResults.tables[tableName] = {
          status: "failed",
          error: tableError.message
        };
      }
    }

    console.log(`✅ Restore completed from: ${backupId}`);
    
    res.status(200).json({
      success: true,
      message: "Restore completed successfully",
      backupId,
      results: restoreResults
    });

  } catch (err) {
    console.error("❌ Restore failed:", err);
    res.status(500).json({
      success: false,
      message: "Restore failed",
      backupId,
      error: err.message
    });
  }
};

/**
 * List all backups
 * GET /api/backup/list
 */
exports.listBackups = async (req, res) => {
  try {
    const backupsSnapshot = await database.ref('backups').once('value');
    const backups = backupsSnapshot.val();

    if (!backups) {
      return res.status(200).json({
        backups: [],
        count: 0
      });
    }

    const backupsList = Object.keys(backups).map(backupId => ({
      backupId,
      ...(backups[backupId].metadata || {})
    }));

    res.status(200).json({
      backups: backupsList,
      count: backupsList.length
    });
  } catch (err) {
    console.error("Failed to list backups:", err);
    res.status(500).json({
      message: "Failed to list backups",
      error: err.message
    });
  }
};

/**
 * Delete a backup
 * DELETE /api/backup/:id
 */
exports.deleteBackup = async (req, res) => {
  const { id } = req.params;

  try {
    await database.ref(`backups/${id}`).remove();
    console.log(`✅ Backup deleted: ${id}`);
    
    res.status(200).json({
      success: true,
      message: "Backup deleted successfully",
      backupId: id
    });
  } catch (err) {
    console.error("Failed to delete backup:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete backup",
      error: err.message
    });
  }
};

/**
 * Get backup details
 * GET /api/backup/details/:id
 */
exports.getBackupDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const metadataSnapshot = await database.ref(`backups/${id}/metadata`).once('value');
    const metadata = metadataSnapshot.val();

    if (!metadata) {
      return res.status(404).json({
        message: "Backup not found"
      });
    }

    res.status(200).json(metadata);
  } catch (err) {
    console.error("Failed to get backup details:", err);
    res.status(500).json({
      message: "Failed to get backup details",
      error: err.message
    });
  }
};