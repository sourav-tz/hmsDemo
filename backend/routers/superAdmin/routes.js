const express = require('express');
const router = express.Router();
const { getCourses,addCourse,removeCourse,enableCourse,updateCourse } = require('../../controllers/superAdmin/Courses');
const { getHostels,addHostel,removeHostel,enableHostel,updateHostel } = require('../../controllers/superAdmin/Hostels');


router.get('/', (req, res) => {
    return res.send('success')
})

router.get('/getCourses/:paranoid', getCourses);
router.post('/addCourse', addCourse);
router.delete('/removeCourse', removeCourse);
router.post('/enableCourse', enableCourse);
router.patch('/updateCourse', updateCourse);

router.get('/getHostels/:paranoid', getHostels);
router.post('/addHostel', addHostel);
router.delete('/removeHostel', removeHostel);
router.post('/enableHostel', enableHostel);
router.patch('/updateHostel', updateHostel);



module.exports = router;