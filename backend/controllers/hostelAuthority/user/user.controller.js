const db = require('../../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const updatePassword = async (req, res) => {
    try {
        const transaction = await db.sequelize.transaction();
        try {
            const { oldPassword, newPassword } = req.body;
            const token = req.cookies.hostelAccessToken;

            if (!token) return res.status(401).json({ error: "Unauthorized" });

            const { email } = jwt.verify(token, process.env.JWT_SECRET_KEY);

            const user = await db.users.findOne({ where: { email } });

            if (!user)
                return res.status(404).json({ error: "User not found" });

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch)
                return res.status(401).json({ error: "Invalid Password" });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await db.users.update({ password: hashedPassword }, { where: { email } });
            await transaction.commit();

            res.status(200).json({ message: "Password updated successfully" });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const email = req.tokenData?.email || req.body.tokenEmail;
        if (!email) return res.status(401).json({ error: "Unauthorized" });

        const profile = await db.hostelauthoritys.findOne({
            where: { email },
            attributes: ['email', 'name', 'roleType', 'mobile', 'hostelNo'],
        });

        if (!profile) return res.status(404).json({ error: "Profile not found" });

        return res.status(200).json({ success: true, data: profile });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updateMobile = async (req, res) => {
    try {
        const email = req.tokenData?.email || req.body.tokenEmail;
        if (!email) return res.status(401).json({ error: "Unauthorized" });

        const { mobile } = req.body;
        if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
            return res.status(400).json({ error: "Enter a valid 10-digit mobile number" });
        }

        await db.hostelauthoritys.update({ mobile }, { where: { email } });

        return res.status(200).json({ success: true, message: "Mobile number updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { updatePassword, getProfile, updateMobile };
