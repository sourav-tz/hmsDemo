const express = require('express');
const router = express.Router();
const  sendOtpForForgetPassword  = require('../../controllers/others/sendOtpForForgetPassword');
const  verifyOtpForForgetPassword = require('../../controllers/others/verifyOtpForForgetPassword');
const  forgotPassword  = require('../../controllers/others/forgotPassword');
const  changePassword   = require('../../controllers/others/changePassword');

//forgotpassword
// step 1 check mail and send otp
router.post('/sendotp',sendOtpForForgetPassword);
// step 2 verify otp
router.post('/verifyotp',verifyOtpForForgetPassword);
// setp 3 match new paas ans confirm password then change password in db
router.post('/forgotPassword',forgotPassword);

// change password (authenticated)
const auth = require('../../middlewares/auth');
router.post('/changePassword', auth, changePassword);




module.exports = router;