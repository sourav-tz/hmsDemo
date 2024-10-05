const db = require('../../models/index');
const ForgetPassOtp = require('../../MailTemplates/ForgetPassOtp');
const sendOtp = require('../../utils/sendOtp');
const sendOtpForForgetPassword = async (req, res) => {

    try {

        const { email } = req.body;
 
        const user = await db.users.findOne({ where: { email: email } });
        console.log(user);
        if (!user) return res.status(404).json({ error: `User doesn't exists` })

            let title = 'OTP for Forget Password || NIT KURUKSHETRA'
             await sendOtp(email,title,ForgetPassOtp("User")).then(() =>{
                return  res.status(200).json({message:'Otp sent successfully'})
             }).catch((error) => {
               return  res.status(404).json({message: "Error in sending OTP", error: error.message});
             });

       
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

module.exports = sendOtpForForgetPassword