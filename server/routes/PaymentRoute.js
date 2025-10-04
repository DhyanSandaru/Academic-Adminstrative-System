const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/PaymentController.js'); 

router.post('/payments', paymentController.addPayment);
router.get('/payments', paymentController.fetchPayments);
router.get('/payments/:id', paymentController.fetchPaymentsByID);

module.exports = router;
