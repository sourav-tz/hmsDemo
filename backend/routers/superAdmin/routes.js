const express = require('express');
const router = express.Router();
const { getCourses, addCourse, removeCourse, enableCourse, updateCourse } = require('../../controllers/superAdmin/Manage_Courses/Courses');
const { getHostels, addHostel, removeHostel, enableHostel, updateHostel } = require('../../controllers/superAdmin/Manage_Hostels/Hostels');
const { getrooms,addroom,updateroom ,deleteroom, getHostelCapacitySummary} = require('../../controllers/superAdmin/ManageRooms/managerooms.js');
const {addRoomType,deleteRoomType,getRoomTypes } = require('../../controllers/superAdmin/Manage_roomTypes');
const { getAdmins,revokeLoginAcess,giveLoginAccess,changeHostel } = require('../../controllers/superAdmin/Manage_Admins');
const multer = require('multer');
const path = require('path');

const AdminRegister = require('../../controllers/superAdmin/Manage_Admins/AdminRegistration')
const { validateUser, AdminRegAuth } = require('../../middlewares/AdminRegAuth');
const { csvToJsonConverter } = require('../../middlewares/csvToJsonConverter');
const addRoomsToHostels = require('../../controllers/superAdmin/Manage_Hostels/addRoomsToHostels');
const {deleteAdmin} = require('../../controllers/superAdmin/Manage_Admins/index.js');
const auth = require('../../middlewares/auth');
const Login = require('../../controllers/Login/Login');
const {verifyOldPassword} = require('../../controllers/superAdmin/Settings');
const {updatePassword} = require('../../controllers/superAdmin/Settings');
const {getAdminsAgainstHostel} = require('../../controllers/superAdmin/Manage_Hostels/Hostels.js');
const superAdminLogin = require('../../controllers/Login/superAdminLogin.js');
const { downloadFile } = require('../../controllers/hostelAuthority/studentModule/downloadFile');

const superAdminLoginToken = require('../../controllers/Login/superAdminLoginToken.js');
const LogOut = require('../../controllers/LoggingOut/LogOut.js');
const { addnotice, getNotices, deleteNotices, downloadNotice, editNotice } = require('../../controllers/superAdmin/Manage_Notices/notices.js');

const getAllRoomsData = require('../../controllers/superAdmin/ManageRooms/getAllRoomsData.js')

const {
    getAllForwardedApplications,
    approveBySuperAdmin,
    rejectBySuperAdmin
  } = require('../../controllers/superAdmin/Manage_Applications/application.controllers.js')
const { getStudentRemarks, createStudentRemark } = require('../../controllers/hostelAuthority/studentModule/studentRemarks.js');
const singleUpload = require('../../middlewares/multer.js');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads'))
    },
    filename: (req, file, cb) => {
        // cb(null, file.originalname);
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
var upload = multer({ storage: storage });


router.get('/', (req, res) => {
    return res.send('success')
})

// auth
router.post('/superlogin', superAdminLogin);
router.post('/superAdminLoginToken',superAdminLoginToken);
router.get('/superAdminLogout', auth, LogOut);
router.post('/verifyOldPassword',auth,verifyOldPassword);
router.post('/updatePassword',auth,updatePassword);


// Manage Course
router.get('/getCourses',auth, getCourses);
router.post('/addCourse',auth, addCourse);
router.delete('/removeCourse',auth, removeCourse);
router.post('/enableCourse',auth, enableCourse);
router.patch('/updateCourse',auth, updateCourse);

// Manage Hostels
router.get('/getHostels',auth, getHostels);
router.post('/addHostel',auth, addHostel);
router.delete('/removeHostel',auth, removeHostel);
router.post('/enableHostel',auth, enableHostel);
router.patch('/updateHostel',auth, updateHostel);

// Notice Routes
router.post('/addNotice', auth, upload.single('file'), addnotice);
router.get('/getNotices', auth, getNotices);
router.delete('/deleteNotices', auth, deleteNotices);
router.get('/downloadNotice/:public_id', auth, downloadNotice);
// Bug fix by Ravi: Bug 15 - No edit/update route existed for notices
router.patch('/editNotice', auth, editNotice);


// RoomsTypes Api's
router.post('/bulkCreate',auth, upload.single('file'), csvToJsonConverter, addRoomsToHostels)  //add rooms to hostels 
router.get('/getRoomTypes',auth, getRoomTypes);
router.post('/addRoomType',auth, addRoomType);
router.delete('/removeRoomType',auth, deleteRoomType);
router.get('/downloadfile',auth, downloadFile);


// Manage rooms                   admin will do update(occupancy,roomtype)
router.get('/getrooms',auth,getrooms);
router.get('/getAllRoomsData',auth,getAllRoomsData);
router.post('/addroom',auth,addroom);
router.patch('/updateroom',auth,updateroom);
router.delete('/deleteroom',auth,deleteroom);
// Bug fix by Ravi: Bug 4 - SA had no endpoint to view aggregated hostel capacity stats
router.get('/hostelCapacity', auth, getHostelCapacitySummary);

//manage admins
router.post('/adminReg',auth, AdminRegister)
router.get('/getAdmins',auth,getAdmins);
router.post('/giveLoginAccess',auth,giveLoginAccess);
router.post('/revokeLoginAccess',auth,revokeLoginAcess);
router.post('/changeHostel',auth,changeHostel);
router.post('/deleteAdmin',auth,deleteAdmin);
router.post('/getAdminsAgainstHostel',auth,getAdminsAgainstHostel);


// manage applications
router.get('/applications', auth, getAllForwardedApplications);
// router.patch('/applications/approve/:id',auth,approveBySuperAdmin);
router.post('/applications/approve/:id', auth, approveBySuperAdmin);

router.post('/applications/reject/:id',auth,rejectBySuperAdmin);
router.get('/student/:rollNo/remarks', auth, getStudentRemarks);
router.post('/student/:rollNo/remarks', auth, singleUpload, createStudentRemark);


module.exports = router;
