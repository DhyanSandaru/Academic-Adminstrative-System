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

    // Get the current count of students for that year
    const [rows] = await db.query(
      `SELECT COUNT(*) as count FROM students WHERE exam_year = ? AND student_id LIKE ?`,
      [examYear, `S${examYear}%`]
    );

    const count = rows[0].count; // current number of students
    const serial = count + 1;    // next serial number

    // Pad serial with leading zeros if you want fixed length (e.g., 2 digits)
    const serialStr = serial.toString().padStart(3, "0");

    
    const studentId = `S${examYear}${serialStr}`;

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
  const [rows] = await db.query(`SELECT student_name,student_id,course,payment_status FROM students`)
  res.json(rows);

 } 
 catch(err){
  console.error("Error fetching students :",err);
  res.status(500).json({message: 'Internal server error'})
 }
}



