const db = require('../DBconfig.js');


exports.fetchTable = async(req,res) => {
    try {
        const [rows] = await db.query(`SELECT * FROM timetable ORDER BY day, start_time`);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch timetable" });
    }
}

exports.addClass = async(req,res) => {
    const { day, startTime, duration, subject, professor, grade } = req.body;
    try {
        await db.execute(
        `INSERT INTO timetable (day, start_time, duration, subject, professor, grade)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [day, startTime, duration, subject, professor, grade]
        );
        res.status(200).json({ message: "Class added successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to add class" });
    }
}

exports.deleteClassById = async (req,res) => {
    const { id } = req.params;
    try {
        await db.execute(`DELETE FROM timetable WHERE id = ?`, [id]);
        res.status(200).json({ message: "Class deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete class" });
    }
}