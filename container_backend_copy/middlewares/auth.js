const jwt = require('jsonwebtoken')
require("dotenv").config();

const auth = (req, res, next) => {
    try {
        const token =
	  req.cookies.hostelAccessToken ||
 	  req.cookies.haToken ||
 	  req.cookies.superAdminToken;

        console.log('=== Auth Middleware Debug ===');
        console.log('1. Token from cookies:', token);
        
        if (!token) {
            console.log('No token found in cookies');
            return res.status(401).send('token expired in auth');
        }

        try {
            const verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log('2. Decoded token payload:', verifyUser);

            // Set token data directly on request object to persist through multer
            req.tokenData = verifyUser;
            
            // Also set on body for backward compatibility
            req.body.tokenEmail = verifyUser.email;
            console.log('3. Set token data on request');

            if (verifyUser.role === 'TempStudent') {
                req.body.TokenRole = 'TempStudent';
                req.body.tempAccountStatus = verifyUser.status;
                console.log('4a. TempStudent role set');
            } else {
                req.body.tokenHostelNo = verifyUser.hostelNo;
                req.body.TokenRole = verifyUser.role;
                console.log('4b. Regular user data set');
            }

            console.log('5. Final request state:', {
                tokenData: req.tokenData,
                bodyData: req.body
            });
            next();
        } catch (error) {
            console.log('Token verification error:', error);
            return res.status(401).send("Invalid token")
        }
    } catch (error) {
        console.log('Auth middleware error:', error);
        return res.status(401).send("Unauthorized request");
    }
}

module.exports = auth
