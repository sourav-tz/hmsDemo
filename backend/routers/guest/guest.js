const express = require("express");
const guestRegister = require("../../controllers/GuestModule/guestRegister");
const auth = require('../../middlewares/auth');
const router = express.Router();
const getApplicationStatus = require("../../controllers/GuestModule/getApplicationStatus");
const {getPendingApplication,rejectApplication,acceptApplication} = require("../../controllers/GuestModule/referrer");
const { guestChat } = require("../../controllers/guest/guestChat");
const {getPendingApplicationAdmin , acceptApplicationAdmin,rejectApplicationAdmin,getApprovedApplicationAdmin, bookRoomAdmin, getSchedule, getDetails} = require("../../controllers/GuestModule/admin");
// Define the route to get the application status by application_id
router.get("/application-status/:application_id", getApplicationStatus);
// Route to handle creating a guest info record
router.post("/register", guestRegister);

//  Route for Referrer
router.get('/getpendingApplication',auth,getPendingApplication);
router.put('/rejectApplication/:application_id',auth,rejectApplication);
router.put('/acceptApplication/:application_id',auth,acceptApplication);

// admin
router.get('/getpendingApplicationAdmin',auth,getPendingApplicationAdmin);
router.put('/rejectApplicationAdmin/:application_id',auth,rejectApplicationAdmin);
router.put('/acceptApplicationAdmin/:application_id',auth,acceptApplicationAdmin);
router.get('/getApprovedApplicationAdmin',auth,getApprovedApplicationAdmin);
router.post('/bookRoomAdmin/:application_id',auth,bookRoomAdmin);
router.get('/getSchedule',auth,getSchedule);
router.get('/getDetails/:application_id/:roomId',auth,getDetails);
router.post("/chat", guestChat);

module.exports = router;
