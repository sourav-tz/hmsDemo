const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { csvToJsonConverter } = require('../../middlewares/csvToJsonConverter');
const { bulkCreateController } = require('../../controllers/hostelAuthority/bulkCreateController');
const { validateUser, AdminRegAuth } = require('../../middlewares/AdminRegAuth')
const AdminRegister = require('../../controllers/Registration/AdminRegistration')
const AdminLogin = require('../../controllers/Login/AdminLogin')
const AdminLogout = require('../../controllers/LoggingOut/AdminLogOut')

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads'))
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage });
console.log(path.join(__dirname, '../../public/uploads'));

router.get('/', (req, res) => {
    return res.send('success')
})
router.post('/bulkCreate', upload.single('file'), csvToJsonConverter, bulkCreateController);



//Admin Api's
router.post('/adminRegister', validateUser, AdminRegAuth, AdminRegister);
router.post('/adminLogin', AdminLogin)
router.get('/adminLogout', AdminLogout)

module.exports = router;