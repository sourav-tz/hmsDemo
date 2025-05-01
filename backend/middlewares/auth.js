const jwt = require('jsonwebtoken')
require("dotenv").config();

const auth = (req, res, next) => {

    try {

        const token = req.cookies.hostelAccessToken;
        console.log('in auth',token);
        if (!token) {
            return res.status(401).send('token expired in auth');
        }

        try {
            const verifyUser = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            )
            req.body.tokenEmail = verifyUser.email;

            // Handle TempStudent role differently
            if (verifyUser.role === 'TempStudent') {
                req.body.TokenRole = 'TempStudent';
                req.body.tempAccountStatus = verifyUser.status;
                console.log('Temp student authenticated:', verifyUser.email, 'Status:', verifyUser.status);
            } else {
                // Regular user
                req.body.tokenHostelNo = verifyUser.hostelNo;
                req.body.TokenRole = verifyUser.role;
                console.log(req.body.tokenHostelNo);
            }

            next();
        } catch (error) {
            return res.status(401).send("Invalid token")
        }
    } catch (error) {
        return res.status(401).send("Unauthorized request");
    }

}

module.exports = auth