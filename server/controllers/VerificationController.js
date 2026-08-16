const db = require('../DBconfig.js');

function generateRandomCode(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

exports.generateCode = async (req, res) => {
  try {
    let code;
    let isUnique = false;

    const [rows] = await db.query('SELECT COUNT(*) AS total FROM registration_codes');
    const count = rows[0].total;
    if (count>= 4){
      await db.query('DELETE FROM registration_codes ORDER BY created_at ASC LIMIT 1')
      console.log("1 code erased from the table")
    }

    // Keep generating until unique (avoid duplicates)
    while (!isUnique) {
      code = generateRandomCode(5);
      const [existing] = await db.query("SELECT code FROM registration_codes WHERE code = ?", [code]);
      isUnique = existing.length === 0;
    }

    // Set expiry time to 15 minutes from now
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await db.query(
      "INSERT INTO registration_codes (code, expires_at) VALUES (?, ?)",
      [code, expiresAt]
    );

    res.json({ code });
  } catch (err) {
    console.error("Error generating code:", err);
    res.status(500).json({ error: "Failed to generate code" });
  }
};

exports.validateCode = async (req, res) => {
  const { code } = req.body;
  console.log(`Received code : ${code}`)

  try {
    const [rows] = await db.query(
      `SELECT * FROM registration_codes
       WHERE code = ? AND used = FALSE AND expires_at > NOW()`,
      [code]
    );

    if (rows.length === 0) {
      return res.status(400).json({ valid: false, message: "Invalid or expired code" });
    }

    // Mark code as used
    await db.query("UPDATE registration_codes SET used = TRUE WHERE code = ?", [code]);

    res.json({ valid: true });
  } catch (err) {
    console.error("Code validation error:", err);
    res.status(500).json({ error: "Server error during validation" });
  }
};

