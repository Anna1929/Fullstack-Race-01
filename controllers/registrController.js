const User = require('../models/user');
const { body, validationResult } = require('express-validator');

class RegistrController {
    static validationRulesOfRegistration = [
        body('login')
            .isAlpha()
            .withMessage('Please use Latin letters without numbers, special characters, or spaces. Example: anna.')
            .trim(),
        body('email')
            .isLowercase()
            .isEmail()
            .withMessage('Please enter a valid email address in lowercase. Example: example@example.com.')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long.')
            .matches(/[A-Z]/)
            .withMessage('Password must contain at least one uppercase letter.')
            .matches(/[!@#$%^&*(),.?":{}|<>]/)
            .withMessage('Password must contain at least one special character.'),
        body('confirm_password')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords do not match');
                }
                return true;
            })
    ];

    static async register(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map(err => err.msg) });
        }

        const { login, email, password, full_name } = req.body;
        try {
            const user = new User({ login, email, password });
            const success = await user.save();
            if (success) {
                res.status(201).json({ message: 'User registered successfully' });
            } else {
                res.status(500).json({ message: 'Failed to register user' });
            }
        } catch (error) {
            res.status(400).json({ errors: [error.message] });
        }
    }
}

module.exports = RegistrController;