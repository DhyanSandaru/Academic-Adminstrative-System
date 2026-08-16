const db = require('../DBconfig.js');

// ==============================
// ADD LECTURER
// ==============================
exports.addLecturer = async (req, res) => {
  try {
    const {
      lecturerName,
      gender,
      email,
      nic,
      mobile,
      address,
      highestQualification,
      institute,
      fieldOfStudy,
      experience,
      certifications
    } = req.body;

    const courseModules = JSON.parse(req.body.courseModules || "[]");

    // If file uploaded, save the relative path
    const profilePhoto = req.file ? `/public/lecturers/${req.file.filename}` : null;

    // Generate joined year automatically
    const joinedYear = new Date().getFullYear();

    // Generate lecturer_id (e.g., L-2025-001)
    const [rows] = await db.query(
      `SELECT lecturer_id
      FROM lecturers
      WHERE joined_year = ?
      AND lecturer_id LIKE ?`,
      [joinedYear, `L-${joinedYear}-%`]
    );

    // Extract all serial numbers into an array of integers
    const serials = rows
      .map(row => parseInt(row.lecturer_id.split("-")[2], 10))
      .sort((a, b) => a - b);

    // Find the lowest missing serial
    let missing = 1;

    for (const s of serials) {
      if (s === missing) {
        missing++;
      } else if (s > missing) {
        break;
      }
    }

    // Format the final ID
    const serialStr = missing.toString().padStart(3, "0");
    const lecturerId = `L-${joinedYear}-${serialStr}`;


    // Current timestamp
    const createdAt = new Date();

    // Insert new lecturer
    await db.query(
      `INSERT INTO lecturers 
      (lecturer_id, lecturer_name, profile_photo, gender, email, nic, mobile, address, highest_qualification, institute, field_of_study, experience, certifications, joined_year, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lecturerId,
        lecturerName,
        profilePhoto,
        gender,
        email,
        nic,
        mobile,
        address,
        highestQualification,
        institute,
        fieldOfStudy,
        experience,
        certifications,
        joinedYear,
        createdAt
      ]
    );

    // Link lecturer to course modules
    for (const moduleName of courseModules) {
      const [moduleRows] = await db.execute(
        'SELECT module_id FROM modules WHERE LOWER(name) = LOWER(?)',
        [moduleName]
      );

      if (moduleRows.length === 0) {
        console.warn(`⚠️ Module "${moduleName}" not found. Skipping.`);
        continue;
      }

      const moduleID = moduleRows[0].module_id;

      await db.execute(
        `INSERT INTO lecturer_modules (lecturer_id, module_id) VALUES (?, ?)`,
        [lecturerId, moduleID]
      );
    }

    res.status(200).json({ message: "✅ Lecturer added successfully!" });
  } catch (err) {
    console.error("❌ Error adding lecturer:", err);
    res.status(500).json({ message: "Failed to insert lecturer." });
  }
};

// ==============================
// FETCH ALL LECTURERS
// ==============================
exports.fetchLecturers = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM lecturers`);

    const formattedData = await Promise.all(
      rows.map(async (lecturer) => {
        const [subjectRows] = await db.query(
          `
          SELECT m.name
          FROM lecturer_modules lm
          JOIN modules m ON lm.module_id = m.module_id
          WHERE lm.lecturer_id = ?
          `,
          [lecturer.lecturer_id]
        );

        const courses = subjectRows.map((row) => row.name);

        return {
          name: lecturer.lecturer_name,
          lecturerId: lecturer.lecturer_id,
          profilePhoto: lecturer.profile_photo,
          gender: lecturer.gender,
          email: lecturer.email,
          nic: lecturer.nic,
          mobile: lecturer.mobile,
          address: lecturer.address,
          highestQualification: lecturer.highest_qualification,
          institute: lecturer.institute,
          fieldOfStudy: lecturer.field_of_study,
          experience: lecturer.experience,
          certifications: lecturer.certifications,
          joinedYear: lecturer.joined_year,
          courses
        };
      })
    );

    res.json(formattedData);
  } catch (err) {
    console.error("Error fetching lecturers:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ==============================
// FETCH SINGLE LECTURER BY ID
// ==============================
exports.fetchLecturerById = async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await db.query(`SELECT * FROM lecturers WHERE lecturer_id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Lecturer not found" });
    }

    const lecturer = rows[0];

    const [moduleRows] = await db.query(
      `
      SELECT m.name 
      FROM lecturer_modules lm
      JOIN modules m ON lm.module_id = m.module_id
      WHERE lm.lecturer_id = ?
      `,
      [id]
    );

    const courses = moduleRows.map((row) => row.name);

    const formattedData = {
      lecturer_name: lecturer.lecturer_name,
      lecturer_id: lecturer.lecturer_id,
      profile_photo: lecturer.profile_photo,
      gender: lecturer.gender,
      email: lecturer.email,
      nic: lecturer.nic,
      mobile: lecturer.mobile,
      address: lecturer.address,
      highest_qualification: lecturer.highest_qualification,
      institute: lecturer.institute,
      field_of_study: lecturer.field_of_study,
      experience: lecturer.experience,
      certifications: lecturer.certifications,
      joined_year: lecturer.joined_year,
      courses
    };

    res.json(formattedData);
  } catch (err) {
    console.error("Error fetching lecturer:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ==============================
// FETCH LECTURERS BY COURSE
// ==============================
exports.fetchLecturersByCourse = async (req, res) => {
  const courseId = req.params.course;

  try {
    
    const [rows] = await db.query(
      `
      SELECT l.lecturer_id, l.lecturer_name, l.email, l.mobile, l.profile_photo
      FROM lecturers l
      JOIN lecturer_modules lm ON l.lecturer_id = lm.lecturer_id
      WHERE lm.module_id = ?
      `,
      [courseId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching lecturers for course:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ==============================
// UPDATE LECTURER BY ID
// ==============================
exports.updateLecturerById = async (req, res) => {
  try {
    const {
      lecturerId,
      name,
      gender,
      email,
      nic,
      mobile,
      address,
      highestQualification,
      institute,
      fieldOfStudy,
      experience,
      certifications
    } = req.body;

    const courseModules = JSON.parse(req.body.courses || "[]");

    // Check lecturer existence
    const [rows] = await db.query(
      `SELECT * FROM lecturers WHERE lecturer_id = ?`,
      [lecturerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Lecturer not found" });
    }

    const oldPhoto = rows[0].profile_photo;
      const profilePhoto = req.file
        ? `/public/lecturers/${req.file.filename}`
        : req.body.profilePhoto; //keep previous if no upload
    
    // Delete old photo only when a new file is uploaded
    if (req.file && oldPhoto) {
      const oldPhotoPath = path.join(__dirname, '../public/lecturers', path.basename(oldPhoto));
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Update lecturer data
    await db.query(
      `UPDATE lecturers 
       SET lecturer_name = ?, 
           profile_photo = ?, 
           gender = ?, 
           email = ?, 
           nic = ?, 
           mobile = ?, 
           address = ?, 
           highest_qualification = ?, 
           institute = ?, 
           field_of_study = ?, 
           experience = ?, 
           certifications = ?
       WHERE lecturer_id = ?`,
      [
        name,
        profilePhoto,
        gender,
        email,
        nic,
        mobile,
        address,
        highestQualification,
        institute,
        fieldOfStudy,
        experience,
        certifications,
        lecturerId
      ]
    );

    await db.query(
        `DELETE FROM lecturer_modules WHERE lecturer_id = ?`,
        [lecturerId]
      );

    if (courseModules.length > 0) {
      for (const moduleName of courseModules) {
        const [moduleRows] = await db.execute(
          'SELECT module_id FROM modules WHERE LOWER(name) = LOWER(?)',
          [moduleName]
        );

        if (moduleRows.length > 0) {
          const moduleID = moduleRows[0].module_id;
          await db.execute(
            `INSERT INTO lecturer_modules (lecturer_id, module_id) VALUES (?, ?)`,
            [lecturerId, moduleID]
          );
          console.log(`${moduleName} added to ${name}`)
        }
      }
    }

    res.status(200).json({ message: "Lecturer updated successfully!" });
  } catch (err) {
    console.error("Error updating lecturer:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteLecturerById = async (req, res) => {
  const id = req.params.id;

  try {
    // Delete from student_modules first to maintain FK integrity
    await db.query("DELETE FROM lecturer_modules WHERE lecturer_id = ?", [id]);
    const [result] = await db.query("DELETE FROM lecturers WHERE lecturer_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Lecturer not found" });
    }

    res.status(200).json({ message: "Lecturer deleted successfully!" });
  } catch (err) {
    console.error("Error deleting lecturer:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
