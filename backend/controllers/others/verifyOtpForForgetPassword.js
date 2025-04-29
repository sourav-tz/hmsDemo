const verifyOtp=require('../../utils/verifyOtp');
const sendOtpForForgetPassword = async (req, res) => {

    try {
        const { email ,otp} = req.body;
             await verifyOtp(email,otp).then((msg) =>{
                return  res.status(200).json({message:msg})
             }).catch((error) => {
               return  res.status(404).json({message: "Error in sending OTP", error: error.message});
             });

       
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

module.exports = sendOtpForForgetPassword