// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const adminController = require('../controllers/AdminController.js');

// Ensure admins folder exists
const adminDir = path.join(__dirname, '../admins');
if (!fs.existsSync(adminDir)) {
  fs.mkdirSync(adminDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, adminDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Routes matching student routes pattern
router.post('/add-admin', upload.single('profilePhoto'), adminController.addAdmin);
router.get('/view-admins', adminController.fetchAdmins);
router.get('/view-admins/id/:id', adminController.getAdminById);
router.put('/view-admins/:id', upload.single('profilePhoto'), adminController.updateAdminById);
router.delete('/delete-admin/:id', adminController.deleteAdminById);

module.exports = router;