const db = require('../../models/index')
const bcrypt = require('bcrypt')

const UsersLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const salt = await bcrypt.genSalt(10)
        const securePassword = await bcrypt.hash(password, salt)

        const user = { email: username, password: securePassword, role: 'Hostel-Authority' };

        await db.Users.create(user)

        res.status(200).json({ success: 'Hostel-Authority(Member) Register into db Successfully' })
    } catch (error) {
        res.status(400).json({ error: error.errors[0].message })
    }

}

module.exports = UsersLogin; 