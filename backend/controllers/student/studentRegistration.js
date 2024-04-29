const db = require('../../models/index')
const bcrypt = require('bcrypt')

const studentRegistration = async (req, res) => {

    try {

        const transaction  = await db.sequelize.transaction();


        try {
            const {rollNo, email, firstName,lastName, password } = req.body;

            const salt = await bcrypt.genSalt(10)
            const securePassword = await bcrypt.hash(password, salt)

            const data = { rollNo:rollNo,email: email, firstName: firstName,lastName: lastName, password: securePassword};
            const user = {  email: email, password: securePassword, role: 'Student' };
          
            await db.users.create(user, { transaction, validate: true })
            await db.students.create(data, { transaction, validate: true })
            const profilesData = {
                rollNo: rollNo,
              };
          
              await db.profiles.create(profilesData, { transaction, validate: true });
          
              // Insert bankdetails
              const bankdetailsData = {
                rollNo: rollNo,
              };
          
              await db.bankdetails.create(bankdetailsData, { transaction, validate: true });


            await transaction.commit();

            res.status(200).json({ success: 'Student Register into db Successfully' })
        } catch (error) {
            // Rollback the transaction on error
            await transaction.rollback();
            console.log("Error in transaction: " + error);
            throw error;
        }


    } catch (error) {
        res.status(400).json({ error: error }) 

    }
}
module.exports = studentRegistration; 