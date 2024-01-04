const express = require('express')
const app = express();
const db = require('./models')
const cors = require("cors");
const studentRouter = require('./routers/students/routes');
const HARouter = require('./routers/hostelAuthority/routes');
const othersRouter = require('./routers/others/routes');
const cookieParser = require('cookie-parser');
require("dotenv").config();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.static('public'));  //*to access public folder
app.disable('x-powered-by'); //*less hackers know about our stack


app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

// routers 
app.use('/student', studentRouter);
app.use('/HA', HARouter);
app.use('/others', othersRouter);


db.sequelize.sync({ alter: true }).then(() => {
    app.listen(3000, () => {
        console.log('listening on post 3000');
    })
})

