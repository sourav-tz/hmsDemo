const jwt = require('jsonwebtoken')
require("dotenv").config();

const auth = (req, res, next) => {

    try {


        const token = req.cookies.hostelAccessToken;

        if (!token) {
            return res.status(401).send('token expired in auth');
        }
        // console.log(cookies);
        // const token = cookies.split("=")[1];
        // // console.log(token);
        // if (!token) {
        //     return res.status(401).send('Token is missing');
        // }

        try {
            const verifyUser = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            )
            // console.log(verifyUser);

            // return res.status(200).send(verifyUser);
            req.body.email = verifyUser.email;
            req.body.hostelNo = verifyUser.hostelNo;
            req.body.role = verifyUser.role;
            next();
        } catch (error) {
            return res.status(401).send("invalid token")
        }
    } catch (error) {
        return res.status(401).send("Unauthorized request");
    }

}

module.exports = auth