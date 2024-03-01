const express = require('express');
const router = express.Router();
const { getCourses, addCourse, removeCourse, enableCourse, updateCourse } = require('../../controllers/superAdmin/Manage_Courses/Courses');
const { getHostels, addHostel, removeHostel, enableHostel, updateHostel } = require('../../controllers/superAdmin/Manage_Hostels/Hostels');
const {addRoomType,deleteRoomType,getRoomTypes } = require('../../controllers/superAdmin/Manage_roomTypes');
const { getAdmins,revokeLoginAcess,giveLoginAccess,changeHostel } = require('../../controllers/superAdmin/Manage_Admins');
const multer = require('multer');
const path = require('path');

const AdminRegister = require('../../controllers/superAdmin/Manage_Admins/AdminRegistration')
const { validateUser, AdminRegAuth } = require('../../middlewares/AdminRegAuth');
const { csvToJsonConverter } = require('../../middlewares/csvToJsonConverter');
const addRoomsToHostels = require('../../controllers/superAdmin/Manage_Hostels/addRoomsToHostels');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads'))
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage });


router.get('/', (req, res) => {
    return res.send('success')
})

router.get('/getCourses', getCourses);
router.post('/addCourse', addCourse);
router.delete('/removeCourse', removeCourse);
router.post('/enableCourse', enableCourse);
router.patch('/updateCourse', updateCourse);

router.get('/getHostels', getHostels);
router.post('/addHostel', addHostel);
router.delete('/removeHostel', removeHostel);
router.post('/enableHostel', enableHostel);
router.patch('/updateHostel', updateHostel);

// Admin registration
router.post('/adminReg', validateUser, AdminRegAuth, AdminRegister)


// Rooms Api's
router.post('/bulkCreate', upload.single('file'), csvToJsonConverter, addRoomsToHostels)  //all hostels 
//TODO  in roomtype table add,update,remove
router.get('/getRoomTypes', getRoomTypes);
router.post('/addRoomType', addRoomType);
router.delete('/removeRoomType', deleteRoomType);

//TODO new single room add in rooms table add,remove                    admin will do update(occupancy,roomtype)
//*bulk,addremove single student ,get room data 
//Todo: timeline , single room add del
//Todo manage admin [revoke login ,give login again , change hostel ]
router.get('/getAdmins',getAdmins);
router.get('/giveLoginAccess',giveLoginAccess);
router.get('/revokeLoginAcess',revokeLoginAcess);
router.get('/changeHostel',changeHostel);
//Todo admin timeline



//todo forgot pass, change password




module.exports = router;