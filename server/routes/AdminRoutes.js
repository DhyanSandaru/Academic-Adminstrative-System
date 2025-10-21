// server/routes/AdminRoute.js
const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController.js');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/admins'); // store uploaded files in server/uploads/admins
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// POST route for adding admin
router.post('/admins', upload.single('profilePhoto'), AdminController.addAdmin);

// Optional GET route
// router.get('/admins', AdminController.getAdmins);

module.exports = router;
