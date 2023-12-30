const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {csvToJsonConverter} = require('../../middlewares/csvToJsonConverter');
const {bulkCreateController} = require('../../controllers/hostelAuthority/studentModule/bulkCreateController');
const {studentsInfo} = require('../../controllers/hostelAuthority/studentModule/studentsInfo');
const {singleStudentInfo} = require('../../controllers/hostelAuthority/studentModule/singleStudentInfo');


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
router.post('/bulkCreate', upload.single('file'),csvToJsonConverter,bulkCreateController);
router.get('/studentsInfo', studentsInfo);
router.get('/student/:rollNo', singleStudentInfo);

module.exports = router;