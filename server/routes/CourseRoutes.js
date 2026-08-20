const express = require('express');
const courseController = require('../controllers/CourseController.js')

const router = express.Router();

router.post("/add-course", courseController.addCourse)
router.get("/get-courses",courseController.fetchCourses);
router.get("/get-courses/:id",courseController.getCourseById);
router.put("/update-course/:id",courseController.updateCourse);
router.delete("/delete-course/:id", courseController.deleteCourse);


module.exports = router;