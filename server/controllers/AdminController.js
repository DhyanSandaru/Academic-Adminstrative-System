// server/controllers/AdminController.js
const db = require('../DBconfig.js');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// @desc    Create new admin
// @route   POST /api/admins/add-admin
// @access  Private
exports.addAdmin = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    role,
    department,
    status,
    nic,
    address,
    gender
  } = req.body;

  const profilePhoto = req.file ? req.file.filename : null;

  // Validation - match AddAdminForm required fields
  if (!name || !email || !password || !phone || !role || !department || !status || !nic || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if admin already exists
    const [existingAdmin] = await db.query(
      'SELECT admin_id FROM admin_accounts WHERE email = ? OR username = ?',
      [email, email]
    );

    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert admin - use email as username
    const [result] = await db.query(
      `INSERT INTO admin_accounts 
      (username, name, email, password, nic, gender, phone, address, profile_photo, role, department, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [email, name, email, hashedPassword, nic, gender || '', phone, address, profilePhoto, role, department, status]
    );

    res.status(200).json({
      message: 'Admin added successfully',
      admin: {
        id: result.insertId,
        name,
        email,
        role,
        department,
        status
      }
    });
  } catch (error) {
    console.error('Error adding admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get admin by ID
// @route   GET /api/admins/view-admins/id/:id
// @access  Private
exports.getAdminById = async (req, res) => {
  const adminId = req.params.id;

  try {
    const [rows] = await db.query(
      `SELECT admin_id, username, name, email, nic, gender, phone, address, 
       profile_photo, role, department, status, last_login, created_at, updated_at 
       FROM admin_accounts WHERE admin_id = ?`,
      [adminId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const admin = rows[0];

    // Format last login
    const lastLogin = admin.last_login 
      ? new Date(admin.last_login).toLocaleString() 
      : 'Never';

    res.status(200).json({
      admin: {
        id: admin.admin_id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        nic: admin.nic,
        gender: admin.gender,
        mobile: admin.phone,
        address: admin.address,
        profilePhoto: admin.profile_photo,
        role: admin.role,
        department: admin.department,
        accountStatus: admin.status,
        lastLogin: lastLogin,
        createdAt: admin.created_at,
        updatedAt: admin.updated_at
      }
    });
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all admins
// @route   GET /api/admins/view-admins
// @access  Private
exports.fetchAdmins = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT admin_id, username, name, email, nic, gender, phone, address, 
       profile_photo, role, department, status, last_login, created_at, updated_at 
       FROM admin_accounts ORDER BY created_at DESC`
    );

    const admins = rows.map(admin => ({
      id: admin.admin_id,
      username: admin.username,
      name: admin.name,
      email: admin.email,
      nic: admin.nic,
      gender: admin.gender,
      mobile: admin.phone,
      address: admin.address,
      profilePhoto: admin.profile_photo,
      role: admin.role,
      department: admin.department,
      accountStatus: admin.status,
      lastLogin: admin.last_login ? new Date(admin.last_login).toLocaleString() : 'Never',
      createdAt: admin.created_at,
      updatedAt: admin.updated_at
    }));

    res.status(200).json({ admins });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update admin
// @route   PUT /api/admins/view-admins/:id
// @access  Private
exports.updateAdminById = async (req, res) => {
  const {id} = req.params;
  const {
    name,
    email,
    nic,
    gender,
    mobile,
    address,
    role,
    department,
    accountStatus
  } = req.body;

  try {
    // Check if admin exists
    const [existingAdmin] = await db.query(
      'SELECT admin_id, profile_photo FROM admin_accounts WHERE admin_id = ?',
      [id]
    );

    if (existingAdmin.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Build dynamic update query
    let updateFields = [];
    let updateValues = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (nic) {
      updateFields.push('nic = ?');
      updateValues.push(nic);
    }
    if (gender !== undefined) {
      updateFields.push('gender = ?');
      updateValues.push(gender);
    }
    if (mobile) {
      updateFields.push('phone = ?');
      updateValues.push(mobile);
    }
    if (address) {
      updateFields.push('address = ?');
      updateValues.push(address);
    }
    if (role) {
      updateFields.push('role = ?');
      updateValues.push(role);
    }
    if (department) {
      updateFields.push('department = ?');
      updateValues.push(department);
    }
    if (accountStatus) {
      updateFields.push('status = ?');
      updateValues.push(accountStatus);
    }

    // Handle profile photo update
    if (req.file) {
      // Delete old photo if exists
      const oldPhoto = existingAdmin[0].profile_photo;
      if (oldPhoto) {
        const oldPhotoPath = path.join(__dirname, '../admins', oldPhoto);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }

      updateFields.push('profile_photo = ?');
      updateValues.push(req.file.filename);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Add admin_id to values array
    updateValues.push(id);

    // Execute update
    await db.query(
      `UPDATE admin_accounts SET ${updateFields.join(', ')} WHERE admin_id = ?`,
      updateValues
    );

    // Fetch updated admin
    const [updatedAdmin] = await db.query(
      `SELECT admin_id, username, name, email, nic, gender, phone, address, 
       profile_photo, role, department, status, last_login 
       FROM admin_accounts WHERE admin_id = ?`,
      [id]
    );

    const admin = updatedAdmin[0];

    res.status(200).json({
      message: 'Admin updated successfully',
      admin: {
        id: admin.admin_id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        nic: admin.nic,
        gender: admin.gender,
        mobile: admin.phone,
        address: admin.address,
        profilePhoto: admin.profile_photo,
        role: admin.role,
        department: admin.department,
        accountStatus: admin.status,
        lastLogin: admin.last_login ? new Date(admin.last_login).toLocaleString() : 'Never'
      }
    });
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete admin
// @route   DELETE /api/admins/delete-admin/:id
// @access  Private
exports.deleteAdminById = async (req, res) => {
  const adminId = req.params.id;

  try {
    // Get admin to delete profile photo
    const [admin] = await db.query(
      'SELECT profile_photo FROM admin_accounts WHERE admin_id = ?',
      [adminId]
    );

    if (admin.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Delete profile photo if exists
    if (admin[0].profile_photo) {
      const photoPath = path.join(__dirname, '../admins', admin[0].profile_photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    // Delete admin from database
    await db.query('DELETE FROM admin_accounts WHERE admin_id = ?', [adminId]);

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};