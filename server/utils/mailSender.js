const nodemailer = require("nodemailer");
const mailSender = async (email, title, body) => {
  try {
    const tansporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    const info = await tansporter.sendMail({
      from: `MindMentorHub`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    return info;
  } catch (error) {
    console.log(`error sending email: ${error}`);
  }
};

module.exports = mailSender;
