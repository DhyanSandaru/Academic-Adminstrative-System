const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/PaymentController.js'); 

router.post('/payments', paymentController.addPayment);
router.get('/payments', paymentController.fetchPayments);
router.get('/payments/:id', paymentController.fetchPaymentsByID);
router.get('/lecturer-payments/:id', paymentController.fetchPaymentsByLecturerID)

module.exports = router;
