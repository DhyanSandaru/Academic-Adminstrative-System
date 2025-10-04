const db = require('../DBconfig');

exports.fetchStudentEmailbyId = async (student_id) => {
    const[rows] = await db.query(
        "SELECT email FROM students WHERE student_id=?",
        [student_id]
    );
    return rows.length > 0 ? rows[0].email : null;
};