const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const helloWorld = require('../controllers/helloWorld')


router.post('/helloWorld', helloWorld);
router.get('/', (req, res) => {
    res.send('success')
})


module.exports = router;