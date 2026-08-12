const jwt = require('jsonwebtoken');
require("dotenv").config();

const auth = (req, res, next) => {
  try {
    const token =
      req.cookies.hostelAccessToken ||
      req.cookies.haToken ||
      req.cookies.superAdminToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.tokenData = decoded;
    req.user = {
      email: decoded.email,
      role: decoded.role,
      hostelNo: decoded.hostelNo ?? null,
      rollNo: decoded.rollNo ?? null,
      status: decoded.status ?? null
    };

    req.body.tokenEmail = decoded.email;
    req.body.TokenRole = decoded.role;

    if (decoded.role === 'TempStudent') {
      req.body.tempAccountStatus = decoded.status;
    } else {
      req.body.tokenHostelNo = decoded.hostelNo;
    }

    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = auth;
