const express = require('express')
const app = express();
const db = require('./models')
const cors = require("cors");
const superAdmin = require('./routers/superAdmin/routes');
const studentRouter = require('./routers/students/routes');
const HARouter = require('./routers/hostelAuthority/routes');
const othersRouter = require('./routers/others/routes');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const  cloudinary = require('cloudinary');
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})



app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.static('public'));  //*to access public folder
app.disable('x-powered-by'); //*less hackers know about our stack




app.use(cors({
	origin:process.env.FRONTEND_URL,
    credentials: true,
}));

// routers 

app.use('/SA', superAdmin); 
app.use('/student', studentRouter);
app.use('/HA', HARouter);
app.use('/others', othersRouter);

app.listen(3000, () => {
        console.log('listening on post 3000');
})

// Handle database connection errors
db.sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
        // return db.sequelize.sync({alter:true});
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
// const sync = (process.env.SYNC) ? JSON.parse(process.env.SYNC) : { alter: true };
// db.sequelize.sync().then(() => {
//     app.listen(3000, () => {
//         console.log('listening on post 3000');
//     })
// })


//test