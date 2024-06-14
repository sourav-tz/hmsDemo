const express = require('express');
const studentRegistration = require('../../controllers/student/studentRegistration');
const router = express.Router();
const {raiseComplaint,getComplaints}=require('../../controllers/student/complaints');
const Login = require('../../controllers/Login/Login');
const auth = require('../../middlewares/auth');
const { getNotices } = require('../../controllers/student/notices');
const LogOut = require('../../controllers/LoggingOut/LogOut');
router.get('/', (req, res) => {
    res.send('success')
})


router.post('/login', Login);
router.get('/studentLogout',auth,LogOut);

router.post('/studentReg' , studentRegistration)
//// Complaints module

router.post("/raiseComplaint",auth,raiseComplaint);
router.get("/getComplaints",auth,getComplaints);

////notices
// router.get('/getNotices',auth,getNotices);


module.exports = router;