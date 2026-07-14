const db = require('../DBconfig.js')

async function generateUniqueModuleId(courseName) {
  const firstLetter = courseName.charAt(0).toUpperCase();

  let uniqueId;
  let exists = true;

  while (exists) {
    const randomNumber = Math.floor(100 + Math.random() * 900); // 3-digit number
    uniqueId = `${firstLetter}${randomNumber}`;

    const [rows] = await db.query(
      "SELECT module_id FROM modules WHERE module_id = ?",
      [uniqueId]
    );

    if (rows.length === 0) {
      exists = false; // unique, exit loop
    }
  }

  return uniqueId;
}

exports.addCourse = async (req, res) => {
  try {
    const {
      courseName,
      payment,
      grade,
      curriculum,
      description,
      courseBanner,
      lecturers 
    } = req.body;

    // Basic validation
    if (
      !courseName ||
      !payment ||
      !grade ||
      !curriculum ||
      !description ||
      !Array.isArray(lecturers) ||
      lecturers.length === 0
    ) {
      return res.status(400).json({ error: "All fields are required, including at least one lecturer." });
    }

    // Check for duplicate course
    const [existingCourse] = await db.query(
      `SELECT module_id
      FROM modules
      WHERE LOWER(name) = LOWER(?)
        AND grade = ?
        AND curriculum = ?
      LIMIT 1`,
      [courseName.trim(), grade, curriculum]
    );

    if (existingCourse.length > 0) {
      return res.status(409).json({
        error: "A course with the same name already exists for this grade and curriculum."
      });
    }

    // 1️⃣ Generate unique module_id
    const moduleId = await generateUniqueModuleId(courseName);

    // 2️⃣ Insert into modules table
    await db.query(
      `INSERT INTO modules (module_id, name, payment, grade, curriculum, description, courseBanner)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [moduleId, courseName, payment, grade, curriculum, description, courseBanner]
    );

    // 3️⃣ Insert into lecturer_modules table
    const lecturerModuleValues = lecturers
      .map(l => {
        const id = l.lecturerId || l.lecturer_id || null;
        return id ? [id, moduleId] : null;
      })
      .filter(Boolean);

    if (lecturerModuleValues.length > 0) {
      await db.query(
        `INSERT INTO lecturer_modules (lecturer_id, module_id) VALUES ?`,
        [lecturerModuleValues]
      );
    }

    res.status(200).json({ message: "Course and lecturers added successfully", moduleId });

  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: "Server error while adding course" });
  }
};

exports.fetchCourses = async (req, res) => {
  try {
    // Fetch modules with associated lecturers
    const [rows] = await db.query(
      `SELECT 
          m.module_id,
          m.name AS course_name,
          m.payment,
          m.grade,
          m.curriculum,
          m.description,
          m.courseBanner,
          GROUP_CONCAT(lm.lecturer_id SEPARATOR ',') AS lecturer_ids,
          GROUP_CONCAT(le.lecturer_name SEPARATOR ', ') AS lecturer_names
       FROM modules m
       LEFT JOIN lecturer_modules lm ON m.module_id = lm.module_id
       LEFT JOIN lecturers le ON lm.lecturer_id = le.lecturer_id
       GROUP BY m.module_id, m.name, m.payment, m.grade, m.curriculum, m.description, m.courseBanner
       ORDER BY m.name ASC`
    );

    // Map each module to the frontend-friendly structure
    const mappedCourses = rows.map(course => ({
      module_id: course.module_id,
      name: course.course_name,
      lecturer: course.lecturer_names || "Not Assigned",
      courseBanner: course.courseBanner,
      payment: course.payment,
      grade: course.grade,
      curriculum: course.curriculum,
      description: course.description
    }));

    res.status(200).json(mappedCourses);

  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Server error while fetching courses" });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params; // module_id passed in URL

    // Fetch the course and related lecturers
    const [rows] = await db.query(
      `SELECT 
          m.module_id,
          m.name AS course_name,
          m.payment,
          m.grade,
          m.curriculum,
          m.description,
          m.courseBanner,
          GROUP_CONCAT(lm.lecturer_id SEPARATOR ',') AS lecturer_ids,
          GROUP_CONCAT(le.lecturer_name SEPARATOR ', ') AS lecturer_names
       FROM modules m
       LEFT JOIN lecturer_modules lm ON m.module_id = lm.module_id
       LEFT JOIN lecturers le ON lm.lecturer_id = le.lecturer_id
       WHERE m.module_id = ?
       GROUP BY m.module_id, m.name, m.payment, m.grade, m.curriculum, m.description, m.courseBanner`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    const course = rows[0];

    const courseData = {
      module_id: course.module_id,
      name: course.course_name,
      lecturer: course.lecturer_names || "Not Assigned",
      lecturer_ids: course.lecturer_ids ? course.lecturer_ids.split(",") : [],
      courseBanner: course.courseBanner,
      payment: course.payment,
      grade: course.grade,
      curriculum: course.curriculum,
      description: course.description
    };

    res.status(200).json(courseData);

  } catch (error) {
    console.error("Error fetching course by ID:", error);
    res.status(500).json({ error: "Server error while fetching course details" });
  }
};


exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params; // module_id from URL
    const {
      name,
      payment,
      grade,
      curriculum,
      description,
      courseBanner,
      lecturers // Expected as JSON string from FormData
    } = req.body;

    // Parse lecturers if it's a JSON string
    let parsedLecturers = [];
    if (lecturers) {
      parsedLecturers = typeof lecturers === 'string' ? JSON.parse(lecturers) : lecturers;
    }

    // 1️⃣ Update modules table
    await db.query(
      `UPDATE modules 
       SET name = ?, 
           payment = ?, 
           grade = ?, 
           curriculum = ?, 
           description = ?, 
           courseBanner = ?
       WHERE module_id = ?`,
      [name, payment, grade, curriculum, description, courseBanner, id]
    );

    // 2️⃣ Delete existing lecturer associations
    await db.query(
      "DELETE FROM lecturer_modules WHERE module_id = ?",
      [id]
    );

    // 3️⃣ Insert new lecturer associations
    if (Array.isArray(parsedLecturers) && parsedLecturers.length > 0) {
      const lecturerModuleValues = parsedLecturers
        .map(l => {
          const lecturerId = l.lecturerId || l.lecturer_id || null;
          return lecturerId ? [lecturerId, id] : null;
        })
        .filter(Boolean);

      if (lecturerModuleValues.length > 0) {
        await db.query(
          "INSERT INTO lecturer_modules (lecturer_id, module_id) VALUES ?",
          [lecturerModuleValues]
        );
      }
    }

    res.status(200).json({ message: "Course updated successfully" });

  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ 
      error: "Server error while updating course",
      message: error.message 
    });
  }
};

