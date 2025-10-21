const db = require('../DBconfig.js');

exports.getAllClasses = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM timetable");

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
          title: `${cls.subject} - ${cls.professor} (Grade ${cls.grade})`,
          start: start,
          end: end,
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
    const { date, day, start_time, end_time, subject, professor, grade } = req.body;

    await db.query(
      "INSERT INTO timetable (date, day, start_time, end_time, subject, professor, grade) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [date, day, start_time, end_time, subject, professor, grade]
    );

    res.status(201).json({ message: "Class added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

exports.updateClass = async (req, res) => {
  const { id } = req.params;
  const { date, start_time, end_time } = req.body;
  
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

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    query += updates.join(", ") + " WHERE id = ?";
    params.push(id);

    await db.execute(query, params);
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