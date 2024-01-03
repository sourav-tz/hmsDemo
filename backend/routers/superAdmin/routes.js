const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const AdminRegister = require('../../controllers/superAdmin/AdminRegistration/AdminRegistration')
const { validateUser, AdminRegAuth } = require('../../middlewares/AdminRegAuth')


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


// Admin registration
router.post('/adminReg', validateUser, AdminRegAuth, AdminRegister)



module.exports = router;