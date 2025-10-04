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

    //to make sure the student id made using examYear will not break routing
    const sanitizedExamYear = examYear.replace(/\s+/g, "").replace(/\//g, "_"); 

    // Get the current count of students for that year
    const  [rows] = await db.query(
      `SELECT COUNT(*) as count FROM students WHERE exam_year = ? AND student_id LIKE ?`,
      [examYear, `S${sanitizedExamYear}%`]
    );

    const count = rows[0].count; // current number of students
    const serial = count + 1;    // next serial number

    // Pad serial with leading zeros if you want fixed length (e.g., 2 digits)
    const serialStr = serial.toString().padStart(3, "0");
    
    const studentId = `S${sanitizedExamYear}${serialStr}`;

    // Insert into students
    await db.query(
      `INSERT INTO students (student_id, student_name, profile_photo, gender, exam_year, email, nic, mobile, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [studentId, studentName, profilePhoto, gender, examYear, email, nic, mobile, address]
    );


    // Insert each course module
    for (const moduleName of courseModules) {
            const [moduleRows] = await db.execute(
                'SELECT module_id from modules WHERE LOWER(name) = LOWER(?)', 
                [moduleName]
            );
            
            if (moduleRows.length === 0) {
                console.warn(`Module "${moduleName}" not found. Skipping.`);
                continue; // Skip this module
            }

            const moduleID = moduleRows[0].module_id; // Fixed: use moduleRows
            await db.execute(
                `INSERT INTO student_modules (student_id, module_id) VALUES (?, ?)`,
                [studentId, moduleID]
            );
      }

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





