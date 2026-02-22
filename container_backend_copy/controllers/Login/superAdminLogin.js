
const db = require('../../models/index');
const sendOtp = require('../../utils/sendOtp');
const bcrypt = require('bcrypt')
const SALoginOTP = require('../../MailTemplates/SALoginOTP');

const superAdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
 
        const user = await db.users.findOne({ where: { email: email } });
        console.log(user);
        if (!user) return res.status(404).json({ error: `User doesn't exists` })

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            console.log("Super Admin Credientials verified");
            let title = 'Super Admin OTP || NIT KURUKSHETRA'
             await sendOtp(email,title,SALoginOTP("Super Admin")).then(() =>{
                const {password , ...userData} = user.dataValues
                console.log(userData);
                return  res.status(200).json({message:'Otp sent successfully', userData})
             }).catch((error) => {
               return  res.status(404).json({message: "Error in sending OTP", error: error.message});
             });



        } else {
            res.status(404).json({message: "Invalid Username or Password"});
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

module.exports = superAdminLogin; 