const express = require('express');
const router = express.Router();
const timeTableController = require('../controllers/TimetableController.js')

router.get('/timetable',timeTableController.fetchTable);
router.post('/timetable',timeTableController.addClass);
router.delete('/timetable/:id',timeTableController.deleteClassById);

module.exports = router;