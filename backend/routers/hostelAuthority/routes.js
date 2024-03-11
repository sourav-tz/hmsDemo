const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { csvToJsonConverter } = require('../../middlewares/csvToJsonConverter');
const { bulkCreateController } = require('../../controllers/hostelAuthority/studentModule/bulkCreateController');
const { studentsInfo } = require('../../controllers/hostelAuthority/studentModule/studentsInfo');
const { deleteStudent } = require('../../controllers/hostelAuthority/studentModule/deleteStudent');
const { singleStudentInfo } = require('../../controllers/hostelAuthority/studentModule/singleStudentInfo');
const { singleStudentUpload } = require('../../controllers/hostelAuthority/studentModule/singleStudentUpload');
const { downloadFile } = require('../../controllers/hostelAuthority/studentModule/downloadFile');
const { updateBulk } = require('../../controllers/hostelAuthority/studentModule/updateBulk');
const AdminLogin = require('../../controllers/Login/AdminLogin')
const AdminLogout = require('../../controllers/LoggingOut/AdminLogOut');
const isCookie = require('../../controllers/isCookie');
const AdminGoogleLogin = require('../../controllers/Login/AdminGoogleLogin');
const bulkRoomAllotmentToStudent = require('../../controllers/hostelAuthority/RoomModule/bulkRoomAllotmentToStudents');
const singleStudentAllot = require('../../controllers/hostelAuthority/RoomModule/singleStudentAllotment');
const auth = require('../../middlewares/auth');
const singleStudentRemove = require('../../controllers/hostelAuthority/RoomModule/singleStudentRemove');
const getRoomsData = require('../../controllers/hostelAuthority/RoomModule/getRoomsData');
const { getCourses, getSingleCourse } = require('../../controllers/hostelAuthority/studentModule/getCourses.controller.js');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads'))
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage });
// console.log(path.join(__dirname, '../../public/uploads'));

router.get('/', (req, res) => {
    return res.send('success')
})

//// Authentication Hostel Authority
router.post('/adminLogin', AdminLogin)
router.post('/adminGoogleLogin', AdminGoogleLogin)
router.get('/adminLogout', auth, AdminLogout)
router.get('/isCookie', isCookie)

////viewInfo Module
//* Apis for bulk
router.post('/bulkCreate', upload.single('file'), csvToJsonConverter, bulkCreateController);
router.patch('/updateBulk', updateBulk);

//* Apis get student information for single or all
router.get('/studentsInfo', auth,studentsInfo);
router.get('/student/:rollNo', auth,singleStudentInfo);
router.get('/getCourses',auth,getCourses)
router.post('/getSingleCourse',auth,getSingleCourse);

//* Apis single student
router.post('/singleStudentUpload', auth,singleStudentUpload);
//todo:update api
router.delete('/deleteStudent', auth,deleteStudent);



////Rooms Module routes

router.post('/bulkRoomAllot', upload.single('file'), csvToJsonConverter, bulkRoomAllotmentToStudent)
router.post('/singleRoomAllot', singleStudentAllot);
router.get('/downloadfile', downloadFile);
router.post('/singleRoomRemove', singleStudentRemove)
router.get('/getRoomsData', getRoomsData)

module.exports = router;