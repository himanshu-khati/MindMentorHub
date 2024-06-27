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
    console.log("email sent successfully");
  } catch (error) {
    console.log(`error occured while sending email: ${error}`);
    throw error;
  }
};

otpSchema.pre("save", async function(next) {
  try {
    await sendVerificationEmail(this.email, this.otp);
    console.log("Email sent successfully");
    next();
  } catch (error) {
    console.log(`Error occurred while sending email: ${error}`);
    next(error);
  }
});

module.exports = mongoose.model("Otp", otpSchema);
