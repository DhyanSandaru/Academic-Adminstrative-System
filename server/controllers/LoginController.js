const Admin = require('../models/LoginModel.js')

// loginController.js
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ message: 'Required' });

  const user = await Admin.login(username, password);

  if(user) return res.json({ message: 'Login successful', user });
  return res.status(401).json({ message: 'Invalid username or password' });
};
