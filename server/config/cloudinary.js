const cloudinary = require("cloudinary").v2;
const cloudinaryConnect = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
      secure: true,
    });
    console.log(`connected to cloudinary`);
  } catch (error) {
    console.log(`error connecting to cloudinary: ${error.message}`);
  }
};
module.exports = cloudinaryConnect;
