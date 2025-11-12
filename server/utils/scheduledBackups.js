const cron = require('node-cron');
const mysqldump = require('mysqldump');
const fs = require('fs');
const path = require('path');
const { database } = require('../firebaseAdmin');
const db = require('../DBconfig');

// Create backups directory if it doesn't exist
const BACKUP_DIR = path.join(__dirname, '../backups');
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log('✅ Backup directory created:', BACKUP_DIR);
}

/**
 * Create MySQL dump file
 */
async function createMySQLDump(backupId) {
  const dumpPath = path.join(BACKUP_DIR, `${backupId}.sql`);
  
  try {
    // Get database connection info
    const config = db.pool.config.connectionConfig;
    
    await mysqldump({
      connection: {
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
      },
      dumpToFile: dumpPath,
    });

    console.log(`✅ MySQL dump created: ${dumpPath}`);
    return { success: true, path: dumpPath };
  } catch (error) {
    console.error('❌ Failed to create MySQL dump:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Backup to Firebase (adapted from BackupController)
 */
async function backupToFirebase(excludeTable = "", backupId = null) {
  if (!backupId) {
    backupId = `backup_${Date.now()}`;
  }

  const backupMetadata = {
    timestamp: new Date().toISOString(),
    status: "in_progress",
    tables: {},
    errors: [],
    type: "automated" // Add type to distinguish automated backups
  };

  try {
    console.log(`🔄 Starting Firebase backup: ${backupId}`);

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
        const [rows] = await db.query(`SELECT * FROM \`${table_name}\``);
        
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

    backupMetadata.status = backupMetadata.errors.length === 0 ? "completed" : "completed_with_errors";
    await database.ref(`backups/${backupId}/metadata`).set(backupMetadata);

    await database.ref('latest_backup').set({
      backupId,
      timestamp: backupMetadata.timestamp,
      status: backupMetadata.status
    });

    console.log(`✅ Firebase backup completed: ${backupId}`);
    return { success: true, backupId, metadata: backupMetadata };

  } catch (err) {
    console.error("❌ Firebase backup failed:", err);
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

    return { success: false, backupId, error: err.message, metadata: backupMetadata };
  }
}

/**
 * Delete old Firebase backups (older than 5 days)
 */
async function deleteOldFirebaseBackups() {
  try {
    console.log('🧹 Cleaning up old Firebase backups...');
    
    const backupsSnapshot = await database.ref('backups').once('value');
    const backups = backupsSnapshot.val();

    if (!backups) {
      console.log('No backups to clean');
      return;
    }

    const fiveDaysAgo = Date.now() - (5 * 24 * 60 * 60 * 1000);
    let deletedCount = 0;

    for (const backupId of Object.keys(backups)) {
      const metadata = backups[backupId].metadata;
      if (metadata && metadata.timestamp) {
        const backupTime = new Date(metadata.timestamp).getTime();
        
        if (backupTime < fiveDaysAgo) {
          await database.ref(`backups/${backupId}`).remove();
          console.log(`🗑️  Deleted old Firebase backup: ${backupId}`);
          deletedCount++;
        }
      }
    }

    console.log(`✅ Cleaned up ${deletedCount} old Firebase backup(s)`);
  } catch (error) {
    console.error('❌ Failed to clean up old Firebase backups:', error);
  }
}

/**
 * Delete old local MySQL dumps (older than 5 days)
 */
async function deleteOldLocalDumps() {
  try {
    console.log('🧹 Cleaning up old local MySQL dumps...');
    
    const files = fs.readdirSync(BACKUP_DIR);
    const fiveDaysAgo = Date.now() - (5 * 24 * 60 * 60 * 1000);
    let deletedCount = 0;

    for (const file of files) {
      if (file.endsWith('.sql')) {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtimeMs < fiveDaysAgo) {
          fs.unlinkSync(filePath);
          console.log(`🗑️  Deleted old dump: ${file}`);
          deletedCount++;
        }
      }
    }

    console.log(`✅ Cleaned up ${deletedCount} old local dump(s)`);
  } catch (error) {
    console.error('❌ Failed to clean up old local dumps:', error);
  }
}

/**
 * Perform complete backup (Firebase + MySQL dump)
 */
async function performCompleteBackup() {
  const backupId = `backup_${Date.now()}`;
  console.log(`\n📦 Starting complete backup: ${backupId}`);
  console.log(`⏰ Time: ${new Date().toLocaleString()}\n`);

  // 1. Create Firebase backup
  const firebaseResult = await backupToFirebase("", backupId);

  // 2. Create MySQL dump
  const dumpResult = await createMySQLDump(backupId);

  // 3. Clean up old backups
  await deleteOldFirebaseBackups();
  await deleteOldLocalDumps();

  console.log(`\n✅ Complete backup finished: ${backupId}\n`);
  
  return {
    backupId,
    firebase: firebaseResult,
    dump: dumpResult,
    timestamp: new Date().toISOString()
  };
}

/**
 * Initialize scheduled backups
 * Runs daily at 2:00 AM
 */
function initializeScheduledBackups() {
  // Schedule: Daily at 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('\n🕐 Scheduled backup triggered at', new Date().toLocaleString());
    await performCompleteBackup();
  });

  console.log('⏰ Scheduled backups initialized (Daily at 2:00 AM)');
  
  // Optional: Run backup on startup (comment out if not needed)
  // setTimeout(() => {
  //   console.log('🚀 Running initial backup on startup...');
  //   performCompleteBackup();
  // }, 5000); // Wait 5 seconds after startup
}

/**
 * Schedule cleanup job
 * Runs daily at 3:00 AM (after backup)
 */
function initializeCleanupSchedule() {
  cron.schedule('0 3 * * *', async () => {
    console.log('\n🧹 Scheduled cleanup triggered at', new Date().toLocaleString());
    await deleteOldFirebaseBackups();
    await deleteOldLocalDumps();
  });

  console.log('⏰ Scheduled cleanup initialized (Daily at 3:00 AM)');
}

module.exports = {
  initializeScheduledBackups,
  initializeCleanupSchedule,
  performCompleteBackup,
  createMySQLDump,
  backupToFirebase,
  deleteOldFirebaseBackups,
  deleteOldLocalDumps
};