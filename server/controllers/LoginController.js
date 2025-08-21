const db = require('../DBconfig.js')

exports.login = async (req,res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
        }

        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: 'Invalid username format' });
        }

        const sql = 'SELECT * FROM admin_accounts WHERE username = ? AND password = ?;';
        const [rows] = await db.execute(sql, [username, password]);

        if (rows.length > 0) {
        return res.json({ message: 'Login successful', user: rows[0] });
        } else {
        return res.status(401).json({ message: 'Invalid username or password' });
        }

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Internal server error' });
  }
};

