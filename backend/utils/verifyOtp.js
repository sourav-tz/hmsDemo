const db = require('../models/index')
const jwt = require('jsonwebtoken')

const verifyOtp = async (email,otp) => {
    try {
     
        
        const recentOtp = await db.otps.findOne({where: {email:email}})
        console.log(recentOtp);
        
        // validate OTP
        if(recentOtp.length == 0){
            return 'OTP not found'
        }else if(otp.length < 6){
            return 'Length of OTP must be 6'
        }else if(otp !== recentOtp.otp){
            return 'Invalid OTP'
        }else if(recentOtp.expiration_time - new Date() < 0){
           return 'OTP expired'
        }
        
        // my otp is valid if i m at this line so i simply 
        // return true for further process
        return true;

        

    } catch (error) {
        console.log('Error in verifying OTP')
        throw error
    }

}

module.exports = verifyOtp;  