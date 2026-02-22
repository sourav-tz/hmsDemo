const verifyOtp = require("../../utils/verifyOtp");
const db = require('../../models/index')
const jwt = require('jsonwebtoken')

const superAdminLoginToken = async(req,res) => {

    try{
        const {email,otp} = req.body;
        const isVerified = await verifyOtp(email,otp);
        if(isVerified != true){
            return res.status(401).json({message : isVerified})
        }


        const user = await db.users.findOne({where: {email: email}})
        
        const {password , ...userData} = user.dataValues
       
        try {
            accessToken = jwt.sign({ email: email, role: user.role },
                process.env.JWT_SECRET_KEY
            );

        } catch (e) {
            console.log("the error occurred generate auth token function" + e);
            return res.status(400).json("the error occurred in generate auth token function" + e);
        }

        const options = {
            // expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            // expires:10000,
            httpOnly: true,
            path: "/",
            sameSite: "none",
	    domain: ".hmsnitkkr.me",	
            secure: true
        }
        // console.log(accessToken);
        // we are storing cookie in jwtoken and it will expires in 30days
        res.cookie('hostelAccessToken', accessToken, options).json({...userData,role:user.role,message:'OTP verified Successfully'});

    }catch(error){

    }

}

module.exports = superAdminLoginToken
