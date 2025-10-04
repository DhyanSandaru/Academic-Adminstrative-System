const db = require('../DBconfig.js')

exports.fetchCourses = async (req,res) => {
    try{
        const [rows] = await db.query(
            `SELECT modules.name,modules.module_id,lecturers.lecturer_name
            FROM lecturer_modules
            JOIN modules ON lecturer_modules.module_id = modules.module_id
            JOIN lecturers ON lecturer_modules.lecturer_id = lecturers.lecturer_id`
        )

        if(rows.length === 0){
            return res.status(404).json({message: "Student not found"})
        }

        res.json(rows)
    }
    catch(err){
        console.error("Error fetching courses from database", err);
        return res.status(500).json({message: "Internal server Error!"})
    }
}