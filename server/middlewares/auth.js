const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth
exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: `token is missing`,
      });
    }
    // verify token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      return ews.status(401).json({
        success: false,
        message: `token is invalid ${error.message}`,
      });
    }
    next();
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong while validation user ${error.message}`,
    });
  }
};

// isStudent
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "student") {
      return res.status(401).json({
        success: false,
        message: `this is a protected route for student`,
      });
    }
    next();
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `user role not matching ${error.message}`,
    });
  }
};

// isInstructor
exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "instructor") {
      return res.status(401).json({
        success: false,
        message: `this is protected route for instructor`,
      });
    }
    next();
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `user role not matching ${error.message}`,
    });
  }
};

// isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "admin") {
      return res.status(401).json({
        success: false,
        message: `this is a protected route for admin`,
      });
    }
    next();
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `user role not matching ${error.message}`,
    });
  }
};
