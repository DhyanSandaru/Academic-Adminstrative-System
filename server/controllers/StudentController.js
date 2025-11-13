const db = require('../DBconfig.js');
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

    //age calcuation
    const today = new Date();
    const dobDate = new Date(dob);

    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }

    // Generate new student ID
    const [rows] = await db.query(
      "SELECT COUNT(*) as count FROM students WHERE exam_year = ?",
      [examYear]
    );
    const count = rows[0].count;
    const studentId = `S-${examYear}-${(count + 1).toString().padStart(3, "0")}`;

    const submittedAt = new Date().toISOString().split("T")[0];
    const payment_status = "Pending";

    await db.execute(
      `INSERT INTO students (
        student_id, student_name, profile_photo, gender, dob, ethnicity,
        exam, exam_year, email, nic, mobile, address,
        guardian_name, guardian_mobile, guardian_relation,
        previous_education, grade, submitted_at, payment_status,age
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        studentId,
        studentName,
        profilePhoto,
        gender,
        dobDate,
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
        payment_status,
        age
      ]
    );

    // Insert related course modules
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
    try {
      await registrationMailer(email, studentName, studentId, grade, examYear);
      console.log("📧 Registration email sent to:", email);
    } catch (mailErr) {
      console.error("⚠️ Failed to send registration email:", mailErr);
    }

    res.status(200).json({ message: "Student added successfully!", studentId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to insert data." });
  }
};

exports.fetchStudents = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT student_name, student_id, profile_photo, gender, payment_status 
      FROM students`
    );
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
          payment_status: student.payment_status,
          courses
        };
      })
    );

    res.json(formattedData);
  } catch (err) {
    console.error("Error fetching students ", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.fetchStudentbyID = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await db.query(`SELECT * FROM students WHERE student_id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = rows[0];
    const [moduleRows] = await db.query(
      `
      SELECT m.name 
      FROM student_modules sm
      JOIN modules m ON sm.module_id = m.module_id
      WHERE sm.student_id = ?
      `,
      [id]
    );

    const courses = moduleRows.map(row => row.name);
    const formattedDOB = student.dob.toISOString().split("T")[0];

    const formattedData = {
      student_name: student.student_name,
      student_id: student.student_id,
      profile_photo: student.profile_photo,
      gender: student.gender,
      dob: formattedDOB,
      ethnicity: student.ethnicity,
      exam: student.exam,
      exam_year: student.exam_year,
      email: student.email,
      nic: student.nic,
      mobile: student.mobile,
      address: student.address,
      guardian_name: student.guardian_name,
      guardian_mobile: student.guardian_mobile,
      guardian_relation: student.guardian_relation,
      previous_education: student.previous_education,
      grade: student.grade,
      submitted_at: student.submitted_at,
      payment_status: student.payment_status,
      age:student.age,
      courses
    };

    res.json(formattedData);
  } catch (err) {
    console.error("Error fetching student by ID", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.fetchStudentbyName = async (req, res) => {
  const studentName = req.params.name;

  try {
    const [rows] = await db.query(
      `SELECT student_id, student_name FROM students WHERE student_name LIKE ? LIMIT 10`,
      [`%${studentName}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error searching students by name:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.fetchStudentEmail = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await db.query(
      "SELECT email FROM students WHERE student_id = ?", [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({ email: rows[0].email });
  } catch (err) {
    console.error("Error fetching student email", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateStudentById = async (req, res) => {
    try {
      const {
        studentId,
        name,
        gender,
        dob,
        ethnicity,
        email,
        nic,
        mobile,
        address,
        guardianName,
        guardianMobile,
        guardianRelation,
        previousEducation,
        grade,
        payment_status,
        age
      } = req.body;

      const profilePhoto = req.file
        ? `/students/${req.file.filename}`
        : req.body.profilePhoto;

      const [rows] = await db.query(`SELECT * FROM students WHERE student_id = ?`, [studentId]);
      if (rows.length === 0) {
        return res.status(404).json({ message: "Student not found" });
      }

      await db.query(
        `UPDATE students 
        SET student_name = ?, profile_photo = ?, gender = ?, dob = ?, ethnicity = ?, 
            email = ?, nic = ?, mobile = ?, address = ?, 
            guardian_name = ?, guardian_mobile = ?, guardian_relation = ?, 
            previous_education = ?, grade = ?, payment_status = ?, age = ?
        WHERE student_id = ?`,
        [
          name,
          profilePhoto,
          gender,
          dob,
          ethnicity,
          email,
          nic,
          mobile,
          address,
          guardianName,
          guardianMobile,
          guardianRelation,
          previousEducation,
          grade,
          payment_status,
          age,
          studentId
        ]
      );

      res.status(200).json({ message: "Student updated successfully!" });
    } catch (err) {
      console.error("Error updating student:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };


exports.deleteStudentById = async (req, res) => {
  const id = req.params.id;

  try {
    // Delete from student_modules first to maintain FK integrity
    await db.query("DELETE FROM student_modules WHERE student_id = ?", [id]);
    const [result] = await db.query("DELETE FROM students WHERE student_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully!" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
