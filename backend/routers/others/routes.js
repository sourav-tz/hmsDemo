const express = require('express');
const router = express.Router();
const  sendotp  = require('../../controllers/others/sendotp');
const  verifyotp  = require('../../controllers/others/verifyotp');
const  forgotPassword  = require('../../controllers/others/forgotPassword');
const  changePassword   = require('../../controllers/others/changePassword');
const auth = require('../../middlewares/auth');
router.get('/', (req, res) => {
    res.send('successs')
})

router.get('/healthCheck',(req,res)=>{res.send('working properly')});
router.post('/sendotp',sendotp);
router.post('/verifyotp',verifyotp);
router.post('/forgotPassword',forgotPassword);
router.post('/changePassword',changePassword);



module.exports = router;