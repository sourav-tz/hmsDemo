const jwt = require('jsonwebtoken')
require("dotenv").config();

const auth = (req, res, next) => {

    try {

        const cookies = req.headers.cookie;

        if (!cookies) {
            return res.status(401).send('cookie expired in auth');
        }

        const token = cookies.split("=")[1];

        if (!token) {
            return res.status(401).send('Token is missing');
        }

        try {
            const verifyUser = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            )
            console.log("verify user in auth middleware = " + verifyUser);
        } catch (error) {
            return res.status(401).send("invalid token")
        }

        next();
    } catch (error) {
        return res.status(401).send("Unauthorized request");
    }

}

module.exports = auth