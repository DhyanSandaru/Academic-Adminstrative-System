const db = require('../DBconfig.js')

const Student = require("../models/StudentModel.js");

exports.addStudent = async (req, res) => {
  try {
    const {
    studentName,
    gender,
    dob,
    ethnicity,
    exam,
    examYear,
    email,
    nic,
    mobile,
    address,
    guardianName,
    guardianMobile,
    guardianRelation,
    previousEducation,
    grade,
  } = req.body;

  const courseModules = JSON.parse(req.body.courseModules || "[]");
  const profilePhoto = req.file ? `/students/${req.file.filename}` : null;

  // Generate Student ID in format: S-2023-001
  const [rows] = await db.query(
    "SELECT COUNT(*) as count FROM students WHERE exam_year = ?",
    [examYear]
  );
  const count = rows[0].count;
  const studentId = `S-${examYear}-${(count + 1).toString().padStart(3, "0")}`;

  // Get current submission date
  const submittedAt = new Date().toISOString().split("T")[0];
  const payment_status = "Pending";

  // Insert main student record
  await db.execute(
    `INSERT INTO students (
      student_id, student_name, profile_photo, gender, dob, ethnicity,
      exam, exam_year, email, nic, mobile, address,
      guardian_name, guardian_mobile, guardian_relation,
      previous_education, grade, submitted_at, payment_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      studentId,
      studentName,
      profilePhoto,
      gender,
      dob,
      ethnicity,
      exam,
      examYear,
      email,
      nic,
      mobile,
      address,
      guardianName,
      guardianMobile,
      guardianRelation,
      previousEducation,
      grade,
      submittedAt,
      payment_status
    ]
  );

  // Insert course module relationships
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
    res.status(200).json({
      message: "Student added successfully!",
      studentId, 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to insert data." });
  }
};


exports.fetchStudents = async(req,res) => {
 try{
  const [rows] = await db.query(`SELECT * FROM students`)
  const formattedData = await Promise.all(
    rows.map(async (student) => {
      const [moduleRows] = await db.query(
        `
        SELECT m.name 
        FROM student_modules sm
        JOIN modules m ON sm.module_id = m.module_id
        WHERE sm.student_id = ?
        `,
        [student.student_id]
      );

      const courses = moduleRows.map(row => row.name);

      return {
        name: student.student_name,
        studentId: student.student_id,
        profilePhoto: student.profile_photo,
        gender: student.gender,
        examYear: student.exam_year,
        email: student.email,
        NIC: student.nic,
        mobile: student.mobile,
        address: student.address,
        payment_status: student.payment_status,
        courses
      };
    })
  );
  res.json(formattedData);

 } 
 catch(err){
  console.error("Error fetching students ",err);
  res.status(500).json({message: 'Internal server error'})
 }
}

exports.fetchStudentEmail = async(req,res) =>{
  const id = req.params.id
  try{
    const [rows] = await db.query(
      "SELECT email FROM students WHERE student_id = ?",[id]
    );

    if(rows.length === 0){
      return res.status(404).json({message: "Student not found"});
    }

    return res.status(200).json({ email: rows[0].email });
  }
  catch(err){
    console.error("Error fetching student email", err);
    return res.status(500).json({error: "Internal server error"})
  }
}

exports.fetchStudentbyName = async(req,res) => {
  const studentName = req.params.name;

  try{
    const [rows] = await db.query(`SELECT student_id, student_name FROM students WHERE student_name LIKE ? LIMIT 10`,
      [`%${studentName}%`]);

    res.json(rows)
  }
  catch(err){
    console.error("Error searching students by name:", err);
    res.status(500).json({ message: "Internal server error" });
  }
} 

exports.fetchStudentbyID = async(req,res) => {
  const id = req.params.id;
  try{
    const[rows] = await db.query(`SELECT * FROM students WHERE student_id=?`,[id]);

    if(rows.length == 0){
      return res.status(404).json({message: "Student not found"});
    }

    const student = rows[0];

    const [moduleRows] = await db.query(`
      SELECT m.name 
      FROM student_modules sm
      JOIN modules m ON sm.module_id = m.module_id
      WHERE sm.student_id = ?
      `, [id]);
    
    const courses = moduleRows.map(row => row.name);

    const formattedData = {
      name: student.student_name,
      studentId: student.student_id,
      profilePhoto: student.profile_photo,
      gender: student.gender,
      dob: student.dob,
      ethnicity: student.ethnicity,
      nationality: student.nationality,
      exam: student.exam,
      examYear: student.exam_year,
      email: student.email,
      nic: student.nic,
      mobile: student.mobile,
      address: student.address,
      previousEducation: student.previous_education,
      grade: student.grade,
      payment_status: student.payment_status,
      courses
    };

    res.json(formattedData)
  }catch(err){
    console.error("Error fetching students ",err);
    res.status(500).json({message: 'Internal server error'})
  }
}

exports.updateStudentById = async (req, res) => {
  const {
    name,
    studentId,
    profilePhoto,
    gender,
    dob,
    ethnicity,
    nationality,
    exam,
    examYear,
    email,
    nic,
    mobile,
    address,
    previousEducation,
    grade,
    payment_status
  } = req.body;

  try {
    const [rows] = await db.query(`SELECT * FROM students WHERE student_id = ?`, [studentId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    await db.query(
      `UPDATE students 
       SET student_name = ?, gender = ?, dob = ?, ethnicity = ?, nationality = ?, 
           exam = ?, exam_year = ?, email = ?, nic = ?, mobile = ?, address = ?, 
           previous_education = ?, grade = ?, profile_photo = ?, payment_status = ?
       WHERE student_id = ?`,
      [
        name,
        gender,
        dob,
        ethnicity,
        nationality,
        exam,
        examYear,
        email,
        nic,
        mobile,
        address,
        previousEducation,
        grade,
        profilePhoto,
        payment_status,
        studentId
      ]
    );

    res.status(200).json({ message: "Student updated successfully!" });
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};






