const express = require("express");
const guestRegister = require("../../controllers/GuestModule/guestRegister");
const auth = require('../../middlewares/auth');
const router = express.Router();
const getApplicationStatus = require("../../controllers/GuestModule/getApplicationStatus");
const {getPendingApplication,rejectApplication,acceptApplication} = require("../../controllers/GuestModule/referrer");

// Define the route to get the application status by application_id
router.get("/application-status/:application_id", getApplicationStatus);
// Route to handle creating a guest info record
router.post("/register", guestRegister);

// // Route for Referrer
router.get('/getpendingApplication',auth,getPendingApplication);
router.put('/rejectApplication/:application_id',auth,rejectApplication);
router.put('/acceptApplication/:application_id',auth,acceptApplication)

module.exports = router;
