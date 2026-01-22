const { body, validationResult } = require('express-validator');

const validateUser = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const AdminRegAuth = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }

    next();
};

module.exports = { validateUser, AdminRegAuth };
