// server/controllers/BackupController.js
const db = require("../DBconfig.js");
const { database } = require("../firebaseAdmin.js");

/**
 * Create a new backup
 * POST /api/backup/create
 */
exports.backupToFirebase = async (req, res) => {
  const { excludeTable="" } = req.body;
  const backupId = `backup_${Date.now()}`;
  const backupMetadata = {
    timestamp: new Date().toISOString(),
    status: "in_progress",
    tables: {},
    errors: []
  };

  try {
    console.log(`🔄 Starting backup: ${backupId}`);

    // Get all table names
    const [tables] = await db.query(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = DATABASE()`
    );

    // Backup each table
    for (const t of tables) {
      const table_name = t.table_name || t.TABLE_NAME;
      if (table_name === excludeTable) {
        console.log(`⏭️  Skipping table: ${table_name}`);
        continue;
      }

      try {
        // Fetch all rows
        const [rows] = await db.query(`SELECT * FROM \`${table_name}\``);
        
        // Convert dates and special types to strings
        const sanitizedRows = rows.map(row => {
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
        });

        // Store in Firebase under backup ID
        await database.ref(`backups/${backupId}/${table_name}`).set(sanitizedRows);
        
        backupMetadata.tables[table_name] = {
          rowCount: rows.length,
          status: "success"
        };

        console.log(`✅ Table "${table_name}" backed up (${rows.length} rows)`);
      } catch (tableError) {
        console.error(`❌ Error backing up table "${table_name}":`, tableError);
        backupMetadata.errors.push({
          table: table_name,
          error: tableError.message
        });
        backupMetadata.tables[table_name] = {
          status: "failed",
          error: tableError.message
        };
      }
    }

    // Update backup metadata
    backupMetadata.status = backupMetadata.errors.length === 0 ? "completed" : "completed_with_errors";
    await database.ref(`backups/${backupId}/metadata`).set(backupMetadata);

    // Store latest backup reference
    await database.ref('latest_backup').set({
      backupId,
      timestamp: backupMetadata.timestamp,
      status: backupMetadata.status
    });

    console.log(`✅ Backup completed: ${backupId}`);
    
    res.status(200).json({
      success: true,
      message: "Backup created successfully",
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
        if (Array.isArray(rows) && rows.length > 0) {
          for (const row of rows) {
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
          rowCount: rows.length,
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