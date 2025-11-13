const db = require('../DBconfig.js');

async function updatePaymentStatus(studentId) {
  // Get enrolled modules
  const [enrolledModules] = await db.execute(
    `SELECT module_id FROM student_modules WHERE student_id = ?`,
    [studentId]
  );

  // Get paid modules
  const [paidModules] = await db.execute(
    `SELECT DISTINCT course_module FROM payments WHERE student_id = ?`,
    [studentId]
  );

  const enrolledSet = new Set(enrolledModules.map(m => m.module_id));
  const paidSet = new Set(paidModules.map(p => p.course_module));

  const allPaid = [...enrolledSet].every(m => paidSet.has(m));

  await db.execute(
    `UPDATE students SET payment_status = ? WHERE student_id = ?`,
    [allPaid ? 'Paid' : 'Pending', studentId]
  );

  return allPaid ? 'Paid' : 'Pending';
}

module.exports = {updatePaymentStatus}
