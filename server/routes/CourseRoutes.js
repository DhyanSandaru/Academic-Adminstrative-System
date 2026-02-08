const express = require('express');
const multer = require('multer');
const courseController = require('../controllers/CourseController.js')

const router = express.Router();

router.post("/add-course", courseController.addCourse)
router.get("/get-courses",courseController.fetchCourses);
router.get("/get-courses/:id",courseController.getCourseById);
router.put("/update-course/:id",courseController.updateCourse);


module.exports = router;