const db = require('../DBconfig.js');

// Add a new lecturer
exports.addLecturer = async (req, res) => {
  try {
    const {
      lecturerName,
      gender,
      qualifications,
      email,
      nic,
      mobile,
      address,
      examYear
    } = req.body;

    const courseModules = JSON.parse(req.body.courseModules || "[]");
    const profilePhoto = req.file ? `/lecturers/${req.file.filename}` : null;

    const sanitizedExamYear = examYear.replace(/\s+/g, "").replace(/\//g, "_");

    const [rows] = await db.query(
      `SELECT COUNT(*) as count FROM lecturers WHERE exam_year = ? AND lecturer_id LIKE ?`,
      [examYear, `L${sanitizedExamYear}%`]
    );

    const count = rows[0].count;
    const serialStr = (count + 1).toString().padStart(3, "0");
    const lecturerId = `L${sanitizedExamYear}${serialStr}`;

    await db.query(
      `INSERT INTO lecturers (lecturer_id, lecturer_name, profile_photo, gender, qualifications, email, nic, mobile, address,exam_year)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [lecturerId, lecturerName, profilePhoto, gender, qualifications, email, nic, mobile, address, examYear]
    );

    for (const moduleName of courseModules) {
      const [moduleRows] = await db.execute(
        'SELECT module_id FROM modules WHERE LOWER(name) = LOWER(?)',
        [moduleName]
      );

      if (moduleRows.length === 0) {
        console.warn(`Module "${moduleName}" not found. Skipping.`);
        continue;
      }

      const moduleID = moduleRows[0].module_id;

      await db.execute(
        `INSERT INTO lecturer_modules (lecturer_id, module_id) VALUES (?, ?)`,
        [lecturerId, moduleID]
      );
    }

    res.status(200).json({ message: "Lecturer added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to insert lecturer." });
  }
};

// Fetch all lecturers
exports.fetchLecturers = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM lecturers`);

    const formattedData = await Promise.all(
      rows.map(async (lecturer) => {
        // Fetch all subjects taught by this lecturer
        const [subjectRows] = await db.query(
          `
          SELECT m.name
          FROM lecturer_modules lm
          JOIN modules m ON lm.module_id = m.module_id
          WHERE lm.lecturer_id = ?
          `,
          [lecturer.lecturer_id]
        );

        const courses = subjectRows.map(row => row.name);

        return {
          name: lecturer.lecturer_name,
          lecturerId: lecturer.lecturer_id,
          profilePhoto: lecturer.profile_photo,
          gender: lecturer.gender,
          qualifications: lecturer.qualifications,
          email: lecturer.email,
          nic: lecturer.nic,
          mobile: lecturer.mobile,
          address: lecturer.address,
          courses
        };
      })
    );

    res.json(formattedData);
  } catch (err) {
    console.error("Error fetching lecturers:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Fetch single lecturer by ID
exports.fetchLecturerById = async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await db.query(`SELECT * FROM lecturers WHERE lecturer_id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Lecturer not found" });
    }

    const lecturer = rows[0];

    const [moduleRows] = await db.query(`
      SELECT m.name 
      FROM lecturer_modules lm
      JOIN modules m ON lm.module_id = m.module_id
      WHERE lm.lecturer_id = ?
    `, [id]);

    const courses = moduleRows.map(row => row.name);

    const formattedData = {
      name: lecturer.lecturer_name,
      lecturerId: lecturer.lecturer_id,
      profilePhoto: lecturer.profile_photo,
      gender: lecturer.gender,
      examYear: lecturer.exam_year,
      qualifications: lecturer.qualifications,
      email: lecturer.email,
      nic: lecturer.nic,
      mobile: lecturer.mobile,
      address: lecturer.address,
      courses
    };

    res.json(formattedData);
  } catch (err) {
    console.error("Error fetching lecturer", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /lecturers/by-course/:courseName
exports.fetchLecturersByCourse = async (req, res) => {
  const courseName = req.params.course;

  try {
    const [rows] = await db.query(
      `
      SELECT l.lecturer_id, l.lecturer_name, l.email, l.mobile
      FROM lecturers l
      JOIN lecturer_modules lm ON l.lecturer_id = lm.lecturer_id
      JOIN modules m ON lm.module_id = m.module_id
      WHERE TRIM(LOWER(m.name)) = TRIM(LOWER(?))
      `,
      [courseName]
    );

    res.json(rows); // returns an array of lecturers
  } catch (err) {
    console.error("Error fetching lecturers for course:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update lecturer by ID
exports.updateLecturerById = async (req, res) => {
  const {
    lecturerId,
    name,
    profilePhoto,
    gender,
    examYear,
    qualifications,
    email,
    nic,
    mobile,
    address
  } = req.body;

  try {
    const [rows] = await db.query(`SELECT * FROM lecturers WHERE lecturer_id = ?`, [lecturerId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Lecturer not found" });
    }

    await db.query(
      `UPDATE lecturers 
       SET lecturer_name = ?, gender = ?, profile_photo = ?, exam_year = ?, qualifications = ?, email = ?, nic = ?, mobile = ?, address = ?
       WHERE lecturer_id = ?`,
      [name, gender, profilePhoto, examYear, qualifications, email, nic, mobile, address, lecturerId]
    );

    res.status(200).json({ message: "Lecturer updated successfully!" });
  } catch (err) {
    console.error("Error updating lecturer:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
