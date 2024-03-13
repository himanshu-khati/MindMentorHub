const User = require("../models/User");
const Otp = require("../models/Otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

// sendotp
exports.sendOtp = async (req, res) => {
  try {
    //fetch email from req.body
    const { email } = req.body;

    // check if user exists
    const checkUserExists = await User.findOne({ email });
    if (checkUserExists) {
      return res.status(401).json({
        success: false,
        message: `user already exists`,
      });
    }
    //   generate otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp generated", otp);
    //   check unique otp
    let result = await Otp.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await Otp.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };
    // save to db
    const otpBody = await Otp.create(otpPayload);
    console.log(otpBody);
    // return response
    res.status(200).json({
      success: true,
      message: `otp sent succesfully`,
      otp,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// signup

exports.signUp = async (req, res) => {
  try {
    // fetch data
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validate data
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(401).json({
        success: false,
        message: "all fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: `password and confirmPassword don't match, please try again`,
      });
    }

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `email already registered`,
      });
    }

    // find most recent otp

    const recentOtp = await Otp.find(
      { email }.sort({ createdAt: -1 }).limit(1)
    );
    console.log(recentOtp);

    // validate otp
    if (recentOtp.length === 0) {
      // otp not found
      return res.status(400).json({
        success: false,
        message: `otp not foind`,
      });
    } else if (otp !== recentOtp) {
      return res.status(400).json({
        success: false,
        message: `otp don't match`,
      });
    }
    // hash password

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileDetails = await Profile.create({
      gender: null,
      dateofbirth: null,
      about: null,
      contactNumber: null,
    });
    // save to database
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${firstName} ${lastName}`,
    });
    // return response
    return res.status(200).json({
      success: true,
      message: `uer registered succesfully`,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: `user can't be registered, ${error.message}`,
    });
  }
};

//* login controller
exports.login = async (req, res) => {
  try {
    //get data from req body
    const { email, password } = req.body;
    // validate data
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: `all fields are required`,
      });
    }
    // check if user exists
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `user is not regstrered, please signup first`,
      });
    }

    // compare password && generate token
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      // create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        message: `login successful`,
        token,
        user,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `password incorrect`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `login failed: ${error.message} `,
    });
  }
};

//* changePassword controller

exports.changePassword = async (req, res) => {
  try {
    const { id, email } = req.user;
    // fetch data from req body -> oldpassword, newPassword, confirmPassword
    const { oldPassword, newPassword, confirmPassword } = req.body;
    // validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(401).json({
        success: false,
        message: `enter all fields`,
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: `password dont match`,
      });
    }
    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // get token from cookies

    // update password
    await User.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
      },
      { new: true }
    );
    // send mail
    await mailSender(
      email,
      "password changed",
      "your password has been changed successfully"
    );
    // return response
    return res.status(200).json({
      success: true,
      message: `password changed successfully`,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong changing password: ${error.message}`,
    });
  }
};
