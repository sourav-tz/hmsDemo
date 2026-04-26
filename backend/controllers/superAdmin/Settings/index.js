const db = require('../../../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: '../../.env' });

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


const getProfile = async (req, res) => {
    try {
        const email = req.tokenData?.email || req.body.tokenEmail;
        if (!email) return res.status(401).json({ error: 'Unauthorized' });

        const user = await db.users.findOne({
            where: { email },
            attributes: ['email', 'role', 'mobile'],
        });
        if (!user) return res.status(404).json({ error: 'User not found' });

        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updateMobile = async (req, res) => {
    try {
        const email = req.tokenData?.email || req.body.tokenEmail;
        if (!email) return res.status(401).json({ error: 'Unauthorized' });

        const { mobile } = req.body;
        if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
            return res.status(400).json({ error: 'Enter a valid 10-digit mobile number' });
        }

        await db.users.update({ mobile }, { where: { email } });
        return res.status(200).json({ success: true, message: 'Mobile number updated successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { verifyOldPassword, updatePassword, getProfile, updateMobile }

