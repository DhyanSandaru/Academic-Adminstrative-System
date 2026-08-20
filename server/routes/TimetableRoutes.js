const express = require('express');
const router = express.Router();
const timeTableController = require('../controllers/TimetableController.js')

router.get('/timetable', timeTableController.getAllClasses);
router.get('/timetable/:course', timeTableController.fetchClassesByCourse);
router.post('/timetable', timeTableController.addClass);
router.put('/timetable/:id', timeTableController.updateClass);
router.delete('/timetable/:id', timeTableController.deleteClassById);
router.post("/duplicate-next-week", timeTableController.duplicateCurrentWeekToNextWeek);

module.exports = router;