// dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/DashboardController.js');

// Flash cards data endpoint
router.get('/flashcards', dashboardController.getFlashCardsData);

// Individual chart endpoints
router.get('/registrations', dashboardController.getStudentRegistrations);
router.get('/revenue', dashboardController.getRevenueData);
router.get('/course-distribution', dashboardController.getCourseDistribution);
router.get('/payment-status', dashboardController.getPaymentStatus);
router.get('/gender-distribution', dashboardController.getGenderDistribution);

module.exports = router;
