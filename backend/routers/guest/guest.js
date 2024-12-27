const express = require("express");
const guestRegister = require("../../controllers/GuestModule/guestRegister");

const router = express.Router();
const getApplicationStatus = require("../../controllers/GuestModule/getApplicationStatus");

// Define the route to get the application status by application_id
router.get("/application-status/:application_id", getApplicationStatus);
// Route to handle creating a guest info record
router.post("/register", guestRegister);

module.exports = router;
