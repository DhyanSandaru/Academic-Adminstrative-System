const express = require('express');
const courseController = require('../controllers/CourseController.js')

const router = express.Router();

router.get("/get-courses",courseController.fetchCourses)

module.exports = router;