const db = require('../DBconfig.js');

exports.fetchStudentEmailbyId = async (student_id) => {
    const[rows] = await db.execute(
        "SELECT email FROM students WHERE student_id=?",
        [student_id]
    );
    return rows.length > 0 ? rows[0].email : null;
};

exports.add = async (req) => {
  

  return { message: "Student added successfully!", studentId };
};

