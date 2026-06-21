// dashboardController.js - Organized by functionality
const db = require('../DBconfig.js');

// ==================== FLASH CARDS DATA ====================
exports.getFlashCardsData = async (req, res) => {
  try {
    const [
      studentCount,
      lecturerCount,
      courseCount,
      monthPayments,
      prevMonthPayments,
      newStudents,
      pendingPayments,
      prevMonthStudents
    ] = await Promise.all([
      db.query(`SELECT COUNT(*) as total FROM students`),
      db.query(`SELECT COUNT(*) as total FROM lecturers`),
      db.query(`SELECT COUNT(DISTINCT module_id) as total FROM modules`),
      db.query(`SELECT SUM(amount) as total FROM payments WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())`),
      db.query(`SELECT SUM(amount) as total FROM payments WHERE MONTH(created_at) = MONTH(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)) AND YEAR(created_at) = YEAR(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))`),
      db.query(`SELECT COUNT(*) as total FROM students WHERE MONTH(submitted_at) = MONTH(CURRENT_DATE()) AND YEAR(submitted_at) = YEAR(CURRENT_DATE())`),
      db.query(`SELECT COUNT(*) as total FROM students WHERE payment_status = 'Pending'`),
      db.query(`SELECT COUNT(*) as total FROM students WHERE submitted_at < DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')`)
    ]);

    // Calculate changes
    const currentTotal = studentCount[0][0].total;
    const previousTotal = prevMonthStudents[0][0].total;
    const studentChange = currentTotal - previousTotal;
    const studentPercentage = previousTotal > 0 
      ? ((studentChange / previousTotal) * 100).toFixed(1) 
      : 0;

    const currentPayment = monthPayments[0][0].total || 0;
    const previousPayment = prevMonthPayments[0][0].total || 0;
    const paymentChange = currentPayment - previousPayment;
    const paymentPercentage = previousPayment > 0 
      ? ((paymentChange / previousPayment) * 100).toFixed(1) 
      : 0;

    res.json({
      totalStudents: {
        value: currentTotal,
        change: studentChange,
        percentage: studentPercentage
      },
      totalLecturers: {
        value: lecturerCount[0][0].total,
        change: 0,
        percentage: 0
      },
      availableCourses: {
        value: courseCount[0][0].total
      },
      monthPayments: {
        value: currentPayment,
        change: paymentChange,
        percentage: paymentPercentage
      },
      newStudents: {
        value: newStudents[0][0].total
      },
      pendingPayments: {
        value: pendingPayments[0][0].total
      }
    });
  } catch (err) {
    console.error('Error fetching flash cards data:', err);
    res.status(500).json({ error: 'Failed to fetch flash cards data.' });
  }
};

// ==================== STUDENT REGISTRATIONS CHART ====================
exports.getStudentRegistrations = async (req, res) => {
  try {
    const [registrations] = await db.query(
      `SELECT 
        DATE_FORMAT(submitted_at, '%b') as month,
        COUNT(*) as registrations
       FROM students 
       WHERE submitted_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(submitted_at, '%Y-%m'), DATE_FORMAT(submitted_at, '%b')
       ORDER BY DATE_FORMAT(submitted_at, '%Y-%m')`
    );
    res.json(registrations);
  } catch (err) {
    console.error('Error fetching student registrations:', err);
    res.status(500).json({ error: 'Failed to fetch registration data.' });
  }
};

// ==================== REVENUE CHART ====================
exports.getRevenueData = async (req, res) => {
  try {
    const [revenue] = await db.query(
      `SELECT 
        DATE_FORMAT(created_at, '%b') as month,
        SUM(amount) as revenue
       FROM payments 
       WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%b')
       ORDER BY DATE_FORMAT(created_at, '%Y-%m')`
    );
    res.json(revenue);
  } catch (err) {
    console.error('Error fetching revenue data:', err);
    res.status(500).json({ error: 'Failed to fetch revenue data.' });
  }
};

// ==================== COURSE DISTRIBUTION CHART ====================
exports.getCourseDistribution = async (req, res) => {
  try {
    const [distribution] = await db.query(
      `SELECT 
        m.name as course,
        COUNT(DISTINCT sm.student_id) as students
       FROM modules m
       LEFT JOIN student_modules sm ON m.module_id = sm.module_id
       GROUP BY m.module_id, m.name
       ORDER BY students DESC
       LIMIT 10`
    );
    res.json(distribution);
  } catch (err) {
    console.error('Error fetching course distribution:', err);
    res.status(500).json({ error: 'Failed to fetch course distribution.' });
  }
};

// ==================== PAYMENT STATUS CHART ====================
exports.getPaymentStatus = async (req, res) => {
  try {
    const [status] = await db.query(
      `SELECT 
        CASE 
          WHEN payment_status IN ('Paid') THEN 'Paid'
          ELSE 'Pending'
        END as name,
        COUNT(*) as value
       FROM students
       GROUP BY CASE 
          WHEN payment_status IN ('Paid') THEN 'Paid'
          ELSE 'Pending'
        END`
    );
    res.json(status);
  } catch (err) {
    console.error('Error fetching payment status:', err);
    res.status(500).json({ error: 'Failed to fetch payment status.' });
  }
};

// ==================== PAYMENT COLLECTION RATE ====================
// ==================== PAYMENT COLLECTION RATE ====================
exports.getPaymentCollectionRate = async (req, res) => {
  try {
    const [rate] = await db.query(
      `SELECT 
        DATE_FORMAT(p.created_at, '%b') as month,
        DATE_FORMAT(p.created_at, '%Y-%m') as month_sort,
        COUNT(DISTINCT sm.student_id) as total_enrolled,
        COUNT(DISTINCT CASE 
          WHEN (
            SELECT COUNT(*) FROM student_modules sm2 
            WHERE sm2.student_id = sm.student_id
          ) = (
            SELECT COUNT(DISTINCT course_module) FROM payments p2 
            WHERE p2.student_id = sm.student_id 
            AND DATE_FORMAT(p2.created_at, '%Y-%m') = DATE_FORMAT(p.created_at, '%Y-%m')
          )
          THEN sm.student_id 
        END) as fully_paid_students,
        ROUND((COUNT(DISTINCT CASE 
          WHEN (
            SELECT COUNT(*) FROM student_modules sm2 
            WHERE sm2.student_id = sm.student_id
          ) = (
            SELECT COUNT(DISTINCT course_module) FROM payments p2 
            WHERE p2.student_id = sm.student_id 
            AND DATE_FORMAT(p2.created_at, '%Y-%m') = DATE_FORMAT(p.created_at, '%Y-%m')
          )
          THEN sm.student_id 
        END) / COUNT(DISTINCT sm.student_id)) * 100, 1) as collection_rate
       FROM payments p
       INNER JOIN student_modules sm ON p.student_id = sm.student_id
       WHERE p.created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(p.created_at, '%Y-%m'), DATE_FORMAT(p.created_at, '%b')
       ORDER BY month_sort`
    );
    res.json(rate);
  } catch (err) {
    console.error('Error fetching payment collection rate:', err);
    res.status(500).json({ error: 'Failed to fetch payment collection rate.' });
  }
};

// ==================== LECTURER WORKLOAD DISTRIBUTION ====================
exports.getLecturerWorkload = async (req, res) => {
  try {
    const [workload] = await db.query(
      `SELECT 
        l.lecturer_name as lecturer,
        COUNT(DISTINCT lm.module_id) as courses,
        COUNT(DISTINCT sm.student_id) as students
       FROM lecturers l
       INNER JOIN lecturer_modules lm ON l.lecturer_id = lm.lecturer_id
       LEFT JOIN student_modules sm ON lm.module_id = sm.module_id
       GROUP BY l.lecturer_id, l.lecturer_name
       ORDER BY courses DESC
       LIMIT 8`
    );
    res.json(workload);
  } catch (err) {
    console.error('Error fetching lecturer workload:', err);
    res.status(500).json({ error: 'Failed to fetch lecturer workload.' });
  }
};

// ==================== PENDING APPLICATIONS ====================
exports.getPendingApplications = async (req, res) => {
  try {
    const [pending] = await db.query(
      `SELECT 
        COUNT(*) as total_pending,
        DATE_FORMAT(submitted_at, '%b') as month
       FROM students
       WHERE payment_status = 'Pending' AND submitted_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(submitted_at, '%Y-%m'), DATE_FORMAT(submitted_at, '%b')
       ORDER BY DATE_FORMAT(submitted_at, '%Y-%m')`
    );
    res.json(pending);
  } catch (err) {
    console.error('Error fetching pending applications:', err);
    res.status(500).json({ error: 'Failed to fetch pending applications.' });
  }
};