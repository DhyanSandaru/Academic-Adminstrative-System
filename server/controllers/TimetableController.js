const db = require('../DBconfig.js');
const { TimetableMailer } = require("../Mailer/TimetableMailer.js");
const {
  formatDateValue,
  getWeekDateRange,
  parseDateValue,
  shiftDateByDays,
} = require("../utils/timetableWeekUtils.js");

exports.getAllClasses = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.id,
        t.date,
        t.start_time,
        t.end_time,
        t.module_id,
        m.name as module_name,
        m.grade as grade,
        GROUP_CONCAT(DISTINCT le.lecturer_name SEPARATOR ', ') as lecturer_name
      FROM timetable t
      JOIN modules m ON t.module_id = m.module_id
      LEFT JOIN lecturer_modules lm ON m.module_id = lm.module_id
      LEFT JOIN lecturers le ON lm.lecturer_id = le.lecturer_id
      GROUP BY t.id, t.date, t.start_time, t.end_time, t.module_id, m.name
    `);

    const formatted = rows
      .filter(cls => cls.date && cls.start_time && cls.end_time)
      .map(cls => {
        // Get date string (handle both Date objects and strings)
        let dateStr;
        if (cls.date instanceof Date) {
          const d = cls.date;
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          dateStr = `${year}-${month}-${day}`;
        } else {
          dateStr = cls.date;
        }

        // Parse start time (HH:MM:SS or HH:MM)
        const startTimeParts = cls.start_time.split(":");
        const startHour = startTimeParts[0].padStart(2, '0');
        const startMinute = startTimeParts[1].padStart(2, '0');
        
        // Parse end time (HH:MM:SS or HH:MM)
        const endTimeParts = cls.end_time.split(":");
        const endHour = endTimeParts[0].padStart(2, '0');
        const endMinute = endTimeParts[1].padStart(2, '0');

        // Build ISO-like strings (no timezone conversion)
        const start = `${dateStr}T${startHour}:${startMinute}:00`;
        const end = `${dateStr}T${endHour}:${endMinute}:00`;

        return {
          id: cls.id,
          title: `${cls.module_name} - ${cls.lecturer_name || 'Not Assigned'}`,
          start: start,
          end: end,
          module_id: cls.module_id,
          module_name: cls.module_name,
          grade: cls.grade,
          lecturer_name: cls.lecturer_name || 'Not Assigned'
        };
      });

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

exports.addClass = async (req, res) => {
  try {
    const { date, day, start_time, end_time, module_id } = req.body;

    // Validation
    if (!date || !day || !start_time || !end_time || !module_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await db.query(
      "INSERT INTO timetable (date, day, start_time, end_time, module_id) VALUES (?, ?, ?, ?, ?)",
      [date, day, start_time, end_time, module_id]
    );

    res.status(201).json({ message: "Class added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

exports.updateClass = async (req, res) => {
  const { id } = req.params;
  const {
    module_id,
    oldDate,
    oldStartTime,
    oldEndTime, 
    date, 
    start_time, 
    end_time
  } = req.body;
  
  try {
    // Build dynamic query based on provided fields
    let query = "UPDATE timetable SET ";
    let params = [];
    let updates = [];

    if (date !== undefined) {
      updates.push("date = ?");
      params.push(date);
    }
    if (start_time !== undefined) {
      updates.push("start_time = ?");
      params.push(start_time);
    }
    if (end_time !== undefined) {
      updates.push("end_time = ?");
      params.push(end_time);
    }
    if (module_id !== undefined) {
      updates.push("module_id = ?");
      params.push(module_id);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    query += updates.join(", ") + " WHERE id = ?";
    params.push(id);

    await db.execute(query, params);

    // Get module name for email notification
    const [moduleRows] = await db.query(
      `SELECT m.name from modules m WHERE m.module_id = ?`,
      [module_id]
    );
    
    const moduleName = moduleRows.length > 0 ? moduleRows[0].name : "Unknown Module";

    const [rows] = await db.query(
      `SELECT email, student_name
      FROM students
      JOIN student_modules
      ON students.student_id = student_modules.student_id
      JOIN modules
      ON student_modules.module_id = modules.module_id
      WHERE modules.module_id = ?
      `,[module_id]
    )

    console.log(`👉 Found ${rows.length} students for module: ${moduleName}`);

    if (rows.length === 0) {
        console.log("⚠️ WARNING: No students found! Check if module ID matches DB exactly.");
    }

    for(const item of rows){
      await TimetableMailer({
        to: item.email,
        module: moduleName,
        studentName: item.student_name, 
        oldDate: oldDate,
        oldStartTime: oldStartTime,
        oldEndTime: oldEndTime,
        newDate: date,
        newStartTime: start_time,
        newEndTime: end_time
      })
    }

    res.status(200).json({ message: "Class updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update class" });
  }
};

exports.deleteClassById = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute(`DELETE FROM timetable WHERE id = ?`, [id]);
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete class" });
  }
};

exports.fetchClassesByCourse = async (req, res) => {
  try {
    // Extract the course name from URL params
    const { course } = req.params;

    if (!course || course.trim() === "") {
      return res.status(400).json({ message: "Course name is required" });
    }

    // Query all timetable records that match this course name
    const [rows] = await db.query(
      "SELECT * FROM timetable WHERE module_id = ?",
      [course]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No classes found for this course" });
    }

    // Return raw data (no formatting)
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching classes by course:", err);
    res.status(500).json({ message: "Database error" });
  }
};


exports.duplicateCurrentWeekToNextWeek = async (req, res) => {
  try {
    const referenceDate = req.body?.referenceDate
      ? new Date(req.body.referenceDate)
      : new Date();

    const { start: currentWeekStart, end: currentWeekEnd } =
      getWeekDateRange(referenceDate);

    const [rows] = await db.query(`
      SELECT date, day, start_time, end_time, module_id
      FROM timetable
      WHERE date IS NOT NULL
    `);

    const currentWeekEntries = rows.filter((row) => {
      const rowDate = parseDateValue(row.date);
      return rowDate && rowDate >= currentWeekStart && rowDate <= currentWeekEnd;
    });

    if (currentWeekEntries.length === 0) {
      return res.status(404).json({ message: "No classes found for this week" });
    }

    const insertValues = currentWeekEntries.map((row) => {
      const shiftedDate = shiftDateByDays(row.date, 7);
      const newDate = formatDateValue(shiftedDate);
      const dayName = shiftedDate.toLocaleDateString("en-US", {
        weekday: "long",
      });

      return [newDate, dayName, row.start_time, row.end_time, row.module_id];
    });

    await db.query(
      "INSERT INTO timetable (date, day, start_time, end_time, module_id) VALUES ?",
      [insertValues]
    );

    res.status(200).json({
      message: `Duplicated ${insertValues.length} classes to next week`,
      count: insertValues.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to duplicate timetable" });
  }
};