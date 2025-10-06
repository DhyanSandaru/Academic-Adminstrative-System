const express = require('express');
const router = express.Router();
const codeController = require('../controllers/VerificationController.js');

router.get('/new-code', codeController.generateCode);
router.post('/validate-code', codeController.validateCode);

module.exports = router;
