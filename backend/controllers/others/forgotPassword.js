const db = require('../../models/index')
const bcrypt = require('bcrypt')
const forgotPassword = async (req, res) => {

    try {
        //extract var
        const {email,password,confirmPassword} = req.body;
          if (confirmPassword !== password) {
            return res.json({
              success: false,
              message: "Password and Confirm Password Does not Match",
            });
          }
          const encryptedPassword = await bcrypt.hash(password, 10);

          // Try updating in main users table first
          const [updatedUsers] = await db.users.update(
            { password: encryptedPassword },
            { where: { email } }
          );

          // If not found in users, update in studentTemp (TempStudents)
          if (!updatedUsers) {
            const [updatedTemp] = await db.studentTemp.update(
              { password: encryptedPassword },
              { where: { email } }
            );
            if (!updatedTemp) {
              return res.json({ success: false, message: 'User not found' });
            }
          }

          return res.json({
            success: true,
            message: 'Password changed successfully',
          });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

module.exports = forgotPassword