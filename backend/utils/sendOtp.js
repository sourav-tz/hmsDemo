
const db = require('../models/index')
const otpGenerator= require('otp-generator')
const mailSender = require('./mailSender')

function AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
  }

const sendOtp = async (email,title,htmlBodyFun) => {

    try {
       
        // generate otp
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })

        console.log('otp generated', otp);

        // check unique otp or not
        const now = new Date();
        const expiration_time = AddMinutesToDate(now,5);
        
        const result = await db.otps.findOne({where:{email : email}})
        console.log('result' ,result);


        if(result){
            await db.otps.update({otp:otp,expiration_time: expiration_time},{where:{email:email}})
        }
        
        const otpPayload = {email,otp,expiration_time}
        await mailSender(email,title,htmlBodyFun(otp))

        if(!result){
         const otpBody = await db.otps.create(otpPayload)
        }
        // console.log(otpBody);

       return 'OTP sent successfully'

    } catch (error) {
        console.log('Error in generating OTP',error);
        throw error
    }

}

module.exports = sendOtp