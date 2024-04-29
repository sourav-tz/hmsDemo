
const db = require('../../models/index')
const otpGenerator= require('otp-generator')

const sendotp = async (req, res) => {

    try {

        const {email} = req.body
       
        // generate otp
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })

        console.log('otp generated', otp);

        // check unique otp or not
        const result = await db.otps.findOne({where : {otp:otp}})

        while(result){
            otp =  otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            })
            result = await db.otps.findOne({where:{otp:otp}})
        }
        
        const otpPayload = {email,otp}

        const otpBody = await db.otps.create(otpPayload)
        console.log(otpBody);

        res.status(200).json({message:'OTP sent successfully'})

    } catch (error) {
        console.log('Error in generating OTP');
        res.status(400).json({ message: error.message })
    }

}

module.exports = sendotp