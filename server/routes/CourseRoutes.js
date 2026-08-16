const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const courseController = require('../controllers/CourseController.js')

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/course_banners');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadDir),
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
	}
});

const upload = multer({ storage });

router.post("/add-course", upload.single('courseBanner'), courseController.addCourse)
router.get("/get-courses",courseController.fetchCourses);
router.get("/get-courses/:id",courseController.getCourseById);
router.put("/update-course/:id",courseController.updateCourse);
router.delete("/delete-course/:id", courseController.deleteCourse);


module.exports = router;