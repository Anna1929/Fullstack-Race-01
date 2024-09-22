const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const {compareSync} = require("bcryptjs");

class AuthController {
    static validationRulesOfRegistration = [
        body('login')
            .isAlpha()
            .withMessage('Please use Latin letters without numbers, special characters, or spaces. Example: anna.')
            .trim(),
        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long.')
            .matches(/[A-Z]/)
            .withMessage('Password must contain at least one uppercase letter.')
            .matches(/[!@#$%^&*(),.?":{}|<>]/)
            .withMessage('Password must contain at least one special character.'),
    ];

    static async login(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map(err => err.msg) });
        }

        const { login, password } = req.body;
        try {
            const user = await User.findByProperty('login', login);
            if (user && compareSync(password, user.password)) {
                req.session.user = user;
                res.status(200).json({ message: 'Login successful'});
            } else {
                res.status(400).json({ errors: ['Invalid login or password'] });
            }
        } catch (error) {
            res.status(500).json({ errors: [error.message] });
        }
    }

    static logout(req, res) {
        req.session.destroy();
        res.redirect('/login');
    }
}

module.exports = AuthController;