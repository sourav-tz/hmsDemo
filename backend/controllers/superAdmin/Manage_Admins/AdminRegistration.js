const db = require('../../../models/index')
const bcrypt = require('bcrypt')

const AdminRegistration = async (req, res) => {

    try {

        const transaction = await db.sequelize.transaction();


        try {
            const { email, name, roleType, mobile, password, hostelNo } = req.body;

            const salt = await bcrypt.genSalt(10)
            const securePassword = await bcrypt.hash(password, salt)

            const data = { email: email, name: name, roleType: roleType, mobile: mobile, hostelNo: hostelNo };
            const user = { email: email, password: securePassword, role: 'Hostel-Authority' };

            await db.users.create(user, { transaction, validate: true })
            await db.hostelauthoritys.create(data, { transaction, validate: true })

            await transaction.commit();

            res.status(200).json({ success: 'Hostel-Authority(Member) Register into db Successfully' })
        } catch (error) {
            // Rollback the transaction on error
            await transaction.rollback();
            console.log("Error in transaction: " + error);
            throw error;
        }


    } catch (error) {
        res.status(400).json({ error: error.errors[0].message })

    }
}
module.exports = AdminRegistration; 