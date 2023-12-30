const express = require('express')
const app = express();
const db = require('./models')
const cors = require("cors");
const studentRouter = require('./routers/students/routes');
const HARouter = require('./routers/hostelAuthority/routes');
const othersRouter = require('./routers/others/routes');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
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

