const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('successs')
})

router.get('/healthCheck',(req,res)=>{res.send('working properly')});



module.exports = router;