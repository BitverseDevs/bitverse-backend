const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-recaptcha-v3', authController.verifyRecaptchaV3);
router.post('/verify-recaptcha-v2', authController.verifyRecaptchaV2);

module.exports = router;