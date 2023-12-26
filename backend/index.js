const express = require('express')
const router = require('./routers/routes.js')
const app = express();
app.use(express.json());

const db = require('./models')


app.use(router);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('listening on post 3001');
    })
})

