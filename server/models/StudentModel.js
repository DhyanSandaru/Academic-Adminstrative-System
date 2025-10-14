const db = require('../DBconfig.js');

exports.fetchStudentEmailbyId = async (student_id) => {
    const[rows] = await db.query(
        "SELECT email FROM students WHERE student_id=?",
        [student_id]
    );
    return rows.length > 0 ? rows[0].email : null;
};

exports.add = async (req) => {
  const {
    studentName,
    gender,
    examYear,
    email,
    nic,
    mobile,
    address,
  } = req.body;

  const courseModules = JSON.parse(req.body.courseModules || "[]");
  const profilePhoto = req.file ? `/students/${req.file.filename}` : null;

  const sanitizedExamYear = examYear.replace(/\s+/g, "").replace(/\//g, "_");

  const [rows] = await db.query(
    `SELECT COUNT(*) as count FROM students WHERE exam_year = ? AND student_id LIKE ?`,
    [examYear, `S${sanitizedExamYear}%`]
  );

  const count = rows[0].count;
  const serialStr = (count + 1).toString().padStart(3, "0");
  const studentId = `S${sanitizedExamYear}${serialStr}`;

  await db.query(
    `INSERT INTO students (student_id, student_name, profile_photo, gender, exam_year, email, nic, mobile, address)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [studentId, studentName, profilePhoto, gender, examYear, email, nic, mobile, address]
  );

  for (const moduleName of courseModules) {
    const [moduleRows] = await db.execute(
      "SELECT module_id FROM modules WHERE LOWER(name) = LOWER(?)",
      [moduleName]
    );

    if (moduleRows.length > 0) {
      const moduleID = moduleRows[0].module_id;
      await db.execute(
        "INSERT INTO student_modules (student_id, module_id) VALUES (?, ?)",
        [studentId, moduleID]
      );
    }
  }
};
