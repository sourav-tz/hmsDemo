const db = require('../../../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({
    path: '../../.env'
});

const verifyOldPassword = async (req, res) => {
    try {
        const { oldPassword } = req.body;
        const tokken = req.cookies.hostelAccessToken;
        if (!tokken) return res.status(401).json({ message: "Token Expired" });
        const email = jwt.verify(tokken, process.env.JWT_SECRET_KEY).email;
        const user = await db.users.findOne({ where: { email: email } });
        if (!user) return res.status(404).json({ error: `User doesn't exists` })

        const isMatch = await bcrypt.compare(oldPassword, user.password);


        if (isMatch) {
            return res.status(200).json({ message: "Password Verified" });
        } else {
            return res.status(401).json({ message: "Invalid Password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updatePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const tokken = req.cookies.hostelAccessToken;
        if (!tokken) return res.status(401).json({ message: "Token Expired" });
        const email = jwt.verify(tokken, process.env.JWT_SECRET_KEY).email;
        const salt = await bcrypt.genSalt(10)
        const securePassword = await bcrypt.hash(newPassword, salt)
        const user = await db.users.update({ password: securePassword }, { where: { email: email } });
        if (!user) return res.status(404).json({ error: `User doesn't exists` })
        return res.status(200).json({ message: "Password Changed Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports = { verifyOldPassword, updatePassword }

