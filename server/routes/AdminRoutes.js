const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');

router.post('/add-admin', adminController.addAdmin);
router.get("/admins/:username", adminController.fetchAdminByUsername);

module.exports = router;
