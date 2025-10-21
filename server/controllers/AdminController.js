// server/controllers/AdminController.js
const db = require('../DBconfig.js');
const path = require('path');
const fs = require('fs');

// Create a new admin with profile photo
exports.addAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  const profilePhoto = req.file ? req.file.filename : null;

  if (!name || !email || !password || !profilePhoto) {
    return res.status(400).json({ message: 'All fields are required including profile photo' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO admins (name, email, password, profile_photo) VALUES (?, ?, ?, ?)',
      [name, email, password, profilePhoto]
    );

    res.status(201).json({
      message: 'Admin added successfully',
      adminId: result.insertId
    });
  } catch (error) {
    console.error('Error adding admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Optional: get all admins
exports.getAdmins = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM admin_accounts');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
