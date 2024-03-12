const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

//* resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from request body
    const { email } = req.body;
    // check user for email, email validaion
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `your email is not registered with us`,
      });
    }
    // genreate token
    const token = crypto.randomUUID();
    // update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );
    // create url
    const url = `https://localhost:3000/update-password/${token}`;
    // send mail conatianing url
    await mailSender(email, "reset mindMentorHub password", url);
    // return response
    return res.status(200).json({
      success: false,
      message: `password changed successfully`,
    });
  } catch (error) {
    return res.status.json({
      success: false,
      message: `something went wrong resetting password: ${error.message}`,
    });
  }
};

//* reset password

exports.resetPasswordToken = async (req, res) => {
  try {
    // fetch data from request body
    const { password, confirmPassword, token } = req.body;
    // validation
    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: `password don't match`,
      });
    }
    // get user details
    const userDetails = await User.findOne({ token: token });
    // if invalid token retun respone
    if (!token) {
      return res.status(400).json({
        success: false,
        message: `token is invalid`,
      });
    }
    // check token expiry time
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(401).json({
        success: false,
        message: `token is expired please generate a new passeord`,
      });
    }
    // hash password'
    const hashedPassword = await bcrypt.hash(password, 10);
    // update password
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );
    // return response
    return res.status(200).json({
      success: true,
      message: `reset password successful`,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong reseting password, please try again : ${error.message} `,
    });
  }
};
