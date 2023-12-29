const express = require('express')
const app = express();
const studentRouter = require('./routers/students/routes');
const db = require('./models')
const HARouter = require('./routers/hostelAuthority/routes');
const othersRouter = require('./routers/others/routes');

app.use(express.json());

//routers
app.use('/student',studentRouter);
app.use('/HA',HARouter);
app.use('/others',othersRouter);


db.sequelize.sync({alter:true}).then(() => {
    app.listen(3000, () => {
        console.log('listening on post 3000');
    })
})

