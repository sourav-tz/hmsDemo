const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { csvToJsonConverter } = require('../../middlewares/csvToJsonConverter');
const { bulkCreateController } = require('../../controllers/hostelAuthority/studentModule/bulkCreateController');
const { studentsInfo } = require('../../controllers/hostelAuthority/studentModule/studentsInfo');
const { deleteStudent } = require('../../controllers/hostelAuthority/studentModule/deleteStudent');
const { singleStudentInfo } = require('../../controllers/hostelAuthority/studentModule/singleStudentInfo');
const { singleStudentUpload,updateSingleStudent } = require('../../controllers/hostelAuthority/studentModule/singleStudentUpload');
const { downloadFile } = require('../../controllers/hostelAuthority/studentModule/downloadFile');
const { updateBulk } = require('../../controllers/hostelAuthority/studentModule/updateBulk');
const Login = require('../../controllers/Login/Login')
const Logout = require('../../controllers/LoggingOut/LogOut');
const isCookie = require('../../controllers/isCookie');
const AdminGoogleLogin = require('../../controllers/Login/AdminGoogleLogin');
const bulkRoomAllotmentToStudent = require('../../controllers/hostelAuthority/RoomModule/bulkRoomAllotmentToStudents');
const singleStudentAllot = require('../../controllers/hostelAuthority/RoomModule/singleStudentAllotment');
const auth = require('../../middlewares/auth.js');
const singleStudentRemove = require('../../controllers/hostelAuthority/RoomModule/singleStudentRemove');
const getRoomsData = require('../../controllers/hostelAuthority/RoomModule/getRoomsData');
const { getCourses, getSingleCourse } = require('../../controllers/hostelAuthority/studentModule/getCourses.controller.js');
const {getComplaintsAdmin,rejectComplaint,resoleComplaint}=require('../../controllers/student/complaints');
const  updatePassword  = require('../../controllers/hostelAuthority/user/user.controller.js');
const {addnotice,getNotices,deleteNotices} =require("../../controllers/hostelAuthority/notices/notices.js")
const singleUpload =  require("../../middlewares/multer.js");
const getRoomTimeline = require('../../controllers/hostelAuthority/RoomModule/getRoomTimeline.js');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads'))
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
var upload = multer({ storage: storage });

router.get('/', (req, res) => {
    return res.send('success')
})

//// Authentication Hostel Authority
router.post('/adminLogin', Login)
router.post('/adminGoogleLogin', AdminGoogleLogin)
router.get('/adminLogout', auth, Logout)
router.get('/isCookie', isCookie)

////viewInfo Module
//* Apis for bulk
router.post('/bulkCreate',auth, upload.single('file'), csvToJsonConverter, bulkCreateController);
router.patch('/updateBulk',auth, updateBulk);

//* Apis get student information for single or all
router.get('/studentsInfo', auth,studentsInfo);
router.get('/student/:rollNo', auth,singleStudentInfo);
router.get('/getCourses',auth,getCourses)
router.post('/getSingleCourse',auth,getSingleCourse);

//* Apis single student
router.post('/singleStudentUpload', auth,singleStudentUpload);
router.patch('/updateSingleStudent', auth,updateSingleStudent);
//todo:update api
router.delete('/deleteStudent', auth,deleteStudent);




////Rooms Module routes

router.post('/bulkRoomAllot',auth, upload.single('file'), csvToJsonConverter, bulkRoomAllotmentToStudent)
router.post('/singleRoomAllot',auth, singleStudentAllot);
router.get('/downloadfile',auth, downloadFile);
router.post('/singleRoomRemove',auth, singleStudentRemove)
router.get('/getRoomsData',auth, getRoomsData)




// Notice Routes
router.post('/addNotice',auth,upload.single('file'), addnotice);
router.get('/getNotices',auth, getNotices);
router.delete('/deleteNotices',auth, deleteNotices);


router.get('/getComplaints',auth,getComplaintsAdmin);
router.post('/rejectComplaint',auth,rejectComplaint);
router.post('/resolveComplaint',auth,resoleComplaint);
module.exports = router;