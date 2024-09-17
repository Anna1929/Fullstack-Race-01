const express = require('express');
const LoginController = require('../controllers/authController');
const RegisterController = require('../controllers/registrController');
const PasswordController = require('../controllers/passwordController');

const router = express.Router();

router.post('/login', LoginController.validationRulesOfRegistration, LoginController.login);
router.post('/register', RegisterController.validationRulesOfRegistration, RegisterController.register);
router.post('/password-reminder', PasswordController.validationRulesOfRegistration, PasswordController.passwordReminder);
router.post('/logout', LoginController.logout);

module.exports = router;