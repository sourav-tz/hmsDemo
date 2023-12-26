const db = require('../models/index')


const helloWorld = async (req, res) => {
    try {
        const data = req.body
        console.log(data)
        await db.Temps.create(data)
        res.json(data)
    } catch (err) {
        res.json(err + "");
    }

}

module.exports = helloWorld; 