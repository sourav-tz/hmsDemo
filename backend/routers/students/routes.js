const express = require('express');
const studentRegistration = require('../../controllers/student/studentRegistration');
const router = express.Router();
const { raiseComplaint, getComplaints } = require('../../controllers/student/complaints');
const { createApplication, getApplications, getApplicationById } = require('../../controllers/student/application'); // Import the functions
const Login = require('../../controllers/Login/Login');
const auth = require('../../middlewares/auth');
const { getNotices } = require("../../controllers/hostelAuthority/notices/notices.js");
const LogOut = require('../../controllers/LoggingOut/LogOut');
const { updateMobile } = require('../../controllers/user/mobile');
//const singleUpload = require('../../middlewares/multer.js');
const memoryUpload = require('../../middlewares/multerMemory.js');


const { checkSchema } = require('express-validator');
const {
  studentSelfProfiling,
  profileValidationSchema,
  getProfile,
  checkRollNumber,
  getAvailableCourses,
  uploadDocument
} = require('../../controllers/student/studentSelfProfiling.js');

router.get('/', (req, res) => {
    res.send('success');
});

// Authentication Routes
router.post('/login', Login);
router.get('/studentLogout',auth,LogOut);
router.patch('/updateMobile', auth, updateMobile);
router.post('/studentReg' , studentRegistration);

// self profiling page
router.post('/studentSelfProfiling',auth,checkSchema(profileValidationSchema), studentSelfProfiling);
router.get('/getProfile', auth, getProfile);
router.get('/checkRollNumber/:rollNo', auth, checkRollNumber); // Added auth middleware for security
router.get('/getAvailableCourses', auth, getAvailableCourses); // Get available courses and branches
router.post('/uploadDocument', auth, memoryUpload, uploadDocument); // Upload documents to Cloudinary

// Complaints Module
router.post("/raiseComplaint", auth, raiseComplaint);
router.post("/getComplaints", auth, getComplaints);

// Notices
router.get('/getNotices', auth, getNotices);

// Application Routes
// Create a new application
router.post('/applications', auth, createApplication); 
// View all applications created by student
router.get('/applications', auth, getApplications);
// View a specific application
router.get('/applications/:id', auth, getApplicationById);

module.exports = router;
