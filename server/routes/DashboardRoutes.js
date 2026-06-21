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
router.get('/payment-collection-rate', dashboardController.getPaymentCollectionRate);
router.get('/lecturer-workload', dashboardController.getLecturerWorkload);
router.get('/pending-applications', dashboardController.getPendingApplications);

module.exports = router;
