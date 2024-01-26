const express = require('express');
const router = express.Router();
const { getCourses, addCourse, removeCourse, enableCourse, updateCourse } = require('../../controllers/superAdmin/Courses');
const { getHostels, addHostel, removeHostel, enableHostel, updateHostel } = require('../../controllers/superAdmin/Hostels');
const multer = require('multer');
const path = require('path');

const AdminRegister = require('../../controllers/superAdmin/AdminRegistration/AdminRegistration')
const { validateUser, AdminRegAuth } = require('../../middlewares/AdminRegAuth');
const { csvToJsonConverter } = require('../../middlewares/csvToJsonConverter');
const addRoomsToHostels = require('../../controllers/superAdmin/Hostels/addRoomsToHostels');


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
router.post('/bulkCreate', upload.single('file'), csvToJsonConverter, addRoomsToHostels)



module.exports = router;