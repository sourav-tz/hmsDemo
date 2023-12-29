const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const helloWorld = require('../controllers/helloWorld')
const UsersLogin = require('../controllers/usersLogin')
const AdminRegister = require('../controllers/Admin/AdminRegistration')
const { validateUser, AdminRegAuth } = require('../middlewares/AdminRegAuth')


// temperory Api's
router.post('/helloWorld', helloWorld);
router.get('/', (req, res) => {
    res.send('success')
})


//Admin Api's
router.post('/AdminReg', validateUser, AdminRegAuth, AdminRegister);


module.exports = router;
