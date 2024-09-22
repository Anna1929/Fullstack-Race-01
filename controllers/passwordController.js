const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const config = require('../config/config.json');


class PasswordController {
    static validationRulesOfRegistration = [
        body('email')
            .isLowercase()
            .isEmail()
            .withMessage('Please enter a valid email address in lowercase. Example: example@example.com.')
            .normalizeEmail(),
    ];

    static async passwordReminder(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map(err => err.msg) });
        }

        const { email } = req.body;
        try {
            const user = await User.findByProperty('email', email);
            if (user) {
                const transporter = nodemailer.createTransport({
                    host: config.email.host,
                    port: config.email.port,
                    secure: config.email.secure,
                    auth: {
                        user: config.email.auth.user,
                        pass: config.email.auth.pass
                    }
                });

                const mailOptions = {
                    from: config.email.auth.user,
                    to: user.email,
                    subject: 'Password Reminder',
                    text: `Your password is: ${user.password}`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return res.status(500).json({errors: [error.message]});
                    } else {
                        res.status(200).json({ message: 'Email sent' });
                    }
                });
            } else {
                res.status(400).json({ errors: ['Email not found'] });
            }
        } catch (error) {
            res.status(500).json({ errors: [error.message] });
        }
    }
}

module.exports = PasswordController;