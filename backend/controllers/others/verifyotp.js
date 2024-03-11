const db = require('../../models/index')

const verifyotp = async (req, res) => {

    try {
       

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

module.exports = verifyotp