const db = require('../DBconfig.js')

const Student = require("../models/StudentModel.js");

exports.addStudent = async (req, res) => {
  try {
    const result = await Student.add(req);
    res.status(200).json({ message: "Student added successfully!" });
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
      examYear: student.exam_year,
      email: student.email,
      nic: student.nic,
      mobile: student.mobile,
      address: student.address,
      payment_status: student.payment_status,
      courses
    }
    res.json(formattedData)
  }catch(err){
    console.error("Error fetching students ",err);
    res.status(500).json({message: 'Internal server error'})
  }
}

exports.updateStudentById = async(req,res) => {
  const{
    name,
    studentId,
    profilePhoto,
    gender,
    examYear,
    email,
    nic,
    mobile,
    address,
    payment_status
  } = req.body;

  try{
    // Check if student exists
    const [rows] = await db.query(`SELECT * FROM students WHERE student_id = ?`, [studentId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update student record
    await db.query(
      `UPDATE students 
       SET student_name = ?, gender = ?, profile_photo=  ?, exam_year = ?, email = ?, nic = ?, mobile = ?, address = ?, payment_status = ?
       WHERE student_id = ?`,
      [name, gender,profilePhoto, examYear, email, nic, mobile, address, payment_status, studentId]
    );
  }
   catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ message: "Internal server error" });
    }
};





