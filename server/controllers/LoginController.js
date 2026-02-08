// server/controllers/LoginController.js
const Admin = require('../models/LoginModel.js');
const db = require('../DBconfig.js');

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Authenticate user
    const user = await Admin.login(username, password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Update last login timestamp
    await db.query(
      'UPDATE admin_accounts SET last_login = NOW() WHERE admin_id = ?',
      [user.admin_id]
    );

    // Return user data (without password)
    return res.json({
      message: 'Login successful',
      user: {
        id: user.admin_id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        status: user.status,
        profilePhoto: user.profile_photo
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};