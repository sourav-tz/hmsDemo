const db = require('../../models/index')

const sendotp = async (req, res) => {

    try {
       

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

module.exports = sendotp