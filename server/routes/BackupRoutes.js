// server/routes/BackupRoutes.js
const express = require('express');
const backupController = require('../controllers/BackupController.js');
const { performCompleteBackup } = require('../utils/scheduledBackups.js');

const router = express.Router();

/**
 * POST /api/backup/create
 * Create a new backup (Firebase + MySQL dump)
 */
router.post('/create', backupController.backupToFirebase);


/**
 * POST /api/backup/restore/:backupId
 * Restore from a specific backup
 */
router.post('/restore/:backupId', backupController.restoreFromFirebase);

/**
 * GET /api/backup/list
 * List all available backups
 */
router.get('/list', backupController.listBackups);

/**
 * GET /api/backup/details/:id
 * Get details of a specific backup
 */
router.get('/details/:id', backupController.getBackupDetails);

/**
 * DELETE /api/backup/:id
 * Delete a specific backup
 */
router.delete('/:id', backupController.deleteBackup);

module.exports = router;