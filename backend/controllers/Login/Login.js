const db = require('../../models/index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const Login = async (req, res) => {

    try {
        const { email, password } = req.body;
 
        const user = await db.users.findOne({ where: { email: email } });
        console.log(user);
        if (!user) return res.status(404).json({ error: `User doesn't exists` })

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            let accessToken;
            let UserData ;

            if(user.role === 'Student'){
                UserData  = await db.students.findOne({ where: {email: email}})
            }else if(user.role === 'Hostel-Authority'){

                UserData= await db.hostelauthoritys.findOne({ where: { email: email } });
            }
          
            console.log("UserData in login controller", UserData);

            try {
                accessToken = jwt.sign({ email: email, hostelNo: UserData.hostelNo, role: user.role },
                    process.env.JWT_SECRET_KEY
                );

            } catch (error) {
                console.log("the error occurred generate auth token function" + error);
                return res.status(400).json("the error occurred in generate auth token function" + error);
            }

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                // expires:10000,
                httpOnly: true,
                path: "/",
                sameSite: 'lax',
                secure: true
            }
            console.log(accessToken);
            // we are storing cookie in jwtoken and it will expires in 30days
            res.cookie('hostelAccessToken', accessToken, options).json({...UserData,role:user.role});

        } else {
            res.status(401).json({message:"Invalid Username or Password"});
        }

    } catch(error){
        console.log(error);
        res.status(500).json({ message: error.message })
    }

}

module.exports = Login