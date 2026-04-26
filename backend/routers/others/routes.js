const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const sendOtpForForgetPassword = require('../../controllers/others/sendOtpForForgetPassword');
const verifyOtpForForgetPassword = require('../../controllers/others/verifyOtpForForgetPassword');
const forgotPassword = require('../../controllers/others/forgotPassword');
const changePassword = require('../../controllers/others/changePassword');

// Forgot password flow (unauthenticated)
router.post('/sendotp', sendOtpForForgetPassword);
router.post('/verifyotp', verifyOtpForForgetPassword);
router.post('/forgotPassword', forgotPassword);

// Change password (logged-in users — students, admins, SA)
router.post('/changePassword', auth, changePassword);




module.exports = router;