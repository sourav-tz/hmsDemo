const jwt = require('jsonwebtoken');
require("dotenv").config();

const AdminLogOut = async (req, res) => {
    try {
        const cookies = req.headers.cookie;
        // console.log('logout cookies = ' + cookies + "\n");
        if (!cookies) {
            return res.status(400).json('cookie expired you can log out');
        }
        const prevToken = cookies.split("=")[1];
        console.log(String(prevToken));

        if (!prevToken) {
            return res.status(400).json('could not find prevtoken ,please login again');
        }

        jwt.verify(
            String(prevToken),
            process.env.JWT_SECRET || 'SECRET_KEY', (err, user) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json("auth failed in logout token");
                }
                res.clearCookie(`${user.email}`);
                req.cookies[`${user.email}`] = "";
                console.log("logged out successfully");
                return res.status(200).json({ "message": "Sucessfully logged out" });
            })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ "message": "error in logout" });
    }
};

module.exports = AdminLogOut;