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
          //encrypt the password
          const encryptedPassword = await bcrypt.hash(password, 10);
          //update the password in db
	         // Update the user's password directly in one query
          const [updated] = await db.users.update(
            { password: encryptedPassword },  // Set new password
            { where: { email } }           // Find user by email
           );
          console.log(updated);
            res.json({
            success: true,
            message: `Password change Successful`,
          });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

module.exports = forgotPassword