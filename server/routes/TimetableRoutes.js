const express = require('express');
const router = express.Router();
const timeTableController = require('../controllers/TimetableController.js')

router.get('/timetable',timeTableController.getAllClasses);
router.post('/timetable',timeTableController.addClass);
router.put('/timetable/:id',timeTableController.updateClass);
router.delete('/timetable/:id',timeTableController.deleteClassById);

module.exports = router;