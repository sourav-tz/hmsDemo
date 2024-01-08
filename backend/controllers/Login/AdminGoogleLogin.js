const db = require('../../models/index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const AdminGoogleLogin = async (req, res) => {

    try {
        const { email, photo } = req.body;

        const user = await db.users.findOne({ where: { email: email } });
        console.log(user);
        if (!user) return res.status(404).json({ error: `User doesn't exists` })


        let accessToken;
        const hostelUser = await db.hostelauthoritys.findOne({ where: { email: email } });

        try {
            accessToken = jwt.sign({ email: email, hostelNo: hostelUser.hostelNo, role: user.role },
                process.env.JWT_SECRET_KEY || "SECRET_KEY"
            );

        } catch (e) {
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


        await db.hostelauthoritys.update({ avatar: photo }, {
            where: {
                email: email
            }
        })

        res.cookie(String(user.email), accessToken, options).json(hostelUser);




    } catch (error) {
        res.status(400).json({ error: error })
    }

}

module.exports = AdminGoogleLogin