// adminModel.js
const db = require('../DBconfig.js');

exports.login = async (username, password) => {
  const sql = 'SELECT * FROM admin_accounts WHERE username = ?;';
  const [rows] = await db.execute(sql, [username]);
  return rows[0] || null;
};
