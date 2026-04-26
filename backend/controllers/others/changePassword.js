const db = require('../../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Old password and new password are required' });
        }

        const token = req.cookies.hostelAccessToken;
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const { email, role } = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Determine which table to update based on role
        let user;
        if (role === 'TempStudent') {
            user = await db.studentTemp.findOne({ where: { email } });
        } else {
            user = await db.users.findOne({ where: { email } });
        }

        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Old password is incorrect' });
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        if (role === 'TempStudent') {
            await db.studentTemp.update({ password: hashed }, { where: { email } });
        } else {
            await db.users.update({ password: hashed }, { where: { email } });
        }

        return res.status(200).json({ success: true, message: 'Password changed successfully' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = changePassword;
