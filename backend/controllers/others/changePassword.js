const db = require('../../models/index')

const changePassword = async (req, res) => {

    try {
       

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

module.exports = changePassword