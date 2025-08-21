const db = require('../DBconfig.js')

exports.addStudent = async (req, res) => {
    try {
    const {
      studentName,
      gender,
      examYear,
      email,
      nic,
      mobile,
      address
    } = req.body;

    // Parse courseModules (which should be sent as a JSON string)
    const courseModules = JSON.parse(req.body.courseModules || "[]");

    // Get relative path of uploaded image
    const profilePhoto = req.file ? `/students/${req.file.filename}` : null;

    // 1. Insert into students
    const [studentResult] = await pool.query(
      `INSERT INTO students (student_name, profile_photo, gender, exam_year, email, nic, mobile, address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [studentName, profilePhoto, gender, examYear, email, nic, mobile, address]
    );

    const studentId = studentResult.insertId;

    // 2. Insert each course module
    for (const moduleName of courseModules) {
      await db.execute(
        `INSERT INTO student_modules (student_id, module_name) VALUES (?, ?)`,
        [studentId, moduleName]
      );
    }

    res.status(200).json({ message: "Student added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to insert data." });
  }
};

exports.fetchStudents = async(req,res) => {
 try{
  const [rows] = await pool.query(`SELECT student_name,id,course,payment_status FROM students`)
  res.json(rows);

 } 
 catch(err){
  console.error("Error fetching students :",err);
  res.status(500).json({error: 'Internal serber error'})
 }
}



