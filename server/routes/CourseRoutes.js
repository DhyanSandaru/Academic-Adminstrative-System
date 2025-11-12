const express = require('express');
const courseController = require('../controllers/CourseController.js')

const router = express.Router();

router.post("/add-course", courseController.addCourse)
router.get("/get-courses",courseController.fetchCourses);
router.get("/get-courses/:id",courseController.getCourseById);



module.exports = router;