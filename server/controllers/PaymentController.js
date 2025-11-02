const db = require('../DBconfig.js'); // make sure the path is correct
const {mailSender} = require('../NodeMailer.js')
const {fetchStudentEmailbyId} = require('../models/StudentModel.js');
const {updatePaymentStatus} = require('../utils/paymentHelper.js')

// Add Payment
exports.addPayment = async (req, res) => {
  try {
    const { studentName, studentId, courseModule, lecturer, amount } = req.body;

    const email = await fetchStudentEmailbyId(studentId);

    if (!email) {
      return res.status(404).json({ message: 'Student email not found' });
    }


    if (!studentName || !studentId || !courseModule || !lecturer || !amount) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Generate a unique reference number
    const generateRefNo = () => {
      const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      return `${datePart}-${randomPart}`;
    };

    const ref_no = generateRefNo();

    const sql = `INSERT INTO payments 
      (ref_no, student_name, student_id, course_module, lecturer, amount) 
      VALUES (?, ?, ?, ?, ?, ?)`;

    await db.execute(sql, [ref_no,studentName, studentId, courseModule, lecturer, amount]);

    try {
      await mailSender(courseModule, email, studentName, amount, ref_no);
    } catch (mailErr) {
      console.error("Email sending failed:", mailErr);
    }

    const status = await updatePaymentStatus(studentId);

     res.status(200).json({
      message: 'Payment added successfully!',
      ref_no,
      payment_status: status
    });
  } catch (err) {
    console.error('Error inserting payment:', err);
    res.status(500).json({ error: 'Failed to insert payment.' });
  }
};


// Fetch Payments
exports.fetchPayments = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT ref_no, student_name, student_id, course_module, lecturer, amount, created_at 
       FROM payments ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ error: 'Failed to fetch payments.' });
  }
};

exports.fetchPaymentsByID = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT ref_no, student_name, student_id, course_module, lecturer, amount, created_at
       FROM payments
       WHERE student_id = ?
       ORDER BY created_at DESC`,
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error fetching student payments:', err);
    res.status(500).json({ error: 'Failed to fetch payments.' });
  }
};
