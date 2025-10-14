// adminModel.js
const db = require('../DBconfig.js');

exports.login = async (username, password) => {
  const sql = 'SELECT * FROM admin_accounts WHERE username = ? AND password = ?;';
  const [rows] = await db.execute(sql, [username, password]);
  return rows[0] || null;
};
