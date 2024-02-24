const { log } = require('console');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const AdminLogOut = async (req, res) => {
    try {
        // console.log(req.body.email);
        const token = req.cookies.hostelAccessToken;


        if (!token) {
            return res.status(400).json('cookie expired you can log out');
        }
        // const prevToken = cookies.split("=")[1];
        // // console.log(String(prevToken));

        // if (!prevToken) {
        //     return res.status(400).json('could not find prevtoken ,please login again');
        // }

        jwt.verify(
            token,
            process.env.JWT_SECRET_KEY, (err, user) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json("auth failed in logout token");
                }

                res.clearCookie('hostelAccessToken');
                // req.cookies[`${user.email}`] = "";
                console.log("logged out successfully");
                return res.status(200).json({ "message": "Sucessfully logged out" });
            })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ "message": "error in logout" });
    }
};

module.exports = AdminLogOut;