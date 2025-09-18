const db = require('../DBconfig.js'); // make sure the path is correct

// Add Payment
exports.addPayment = async (req, res) => {
  try {
    const { studentName, studentId, courseModule, lecturer, amount } = req.body;

    console.log('Request body:', req.body); // debug log

    if (!studentName || !studentId || !courseModule || !lecturer || !amount) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const sql = `INSERT INTO payments 
      (student_name, student_id, course_module, lecturer, amount) 
      VALUES (?, ?, ?, ?, ?)`;

    await db.execute(sql, [studentName, studentId, courseModule, lecturer, amount]);

    res.status(200).json({ message: 'Payment added successfully!' });
  } catch (err) {
    console.error('Error inserting payment:', err);
    res.status(500).json({ error: 'Failed to insert payment.' });
  }
};

// Fetch Payments
exports.fetchPayments = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, student_name, student_id, course_module, lecturer, amount, created_at 
       FROM payments ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ error: 'Failed to fetch payments.' });
  }
};
