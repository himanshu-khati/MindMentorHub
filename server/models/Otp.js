const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

// send email
const sendVerificationEmail = async (email, otp) => {
  try {
    const mailResponse = await mailSender(
      email,
      "verification email from MindMentorHub",
      otp
    );
    console.log("email send successfully");
  } catch (error) {
    console.log(`error occured while sending email: ${error}`);
    throw error;
  }
};

otpSchema.pre("save", async (next) => {
  await sendVerificationEmail(this.email, this.otp);
  next();
});

module.exports = mongoose.Model("Otp", otpSchema);
