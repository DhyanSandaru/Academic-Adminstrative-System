const db = require('../DBconfig.js');
const bcrypt = require('bcrypt');

// Add Admin (only store username, email, password)
exports.addAdmin = async (req, res) => {
  try {
    const { adminName, email, password } = req.body;

    if (!adminName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if email exists
    const [existing] = await db.query(`SELECT * FROM admins WHERE email = ?`, [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Admin already exists with this email.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert only required fields
    await db.query(
      `INSERT INTO admins (username, email, password) VALUES (?, ?, ?)`,
      [adminName, email, hashedPassword]
    );

    res.status(200).json({ message: 'Admin registered successfully!' });
  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).json({ message: 'Failed to register admin.' });
  }
};


exports.fetchAdminByUsername = async (req, res) => {
  const username = req.params.username; // from frontend
  try {
    const [rows] = await db.query(
      "SELECT admin_id, username, email FROM admins WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(rows[0]); // send admin data
  } catch (err) {
    console.error("Error fetching admin:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};