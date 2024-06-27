const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  const options = { folder };
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }
  options.resourse_type = "auto";
  console.log("cloudinary options: ", options);
  return await cloudinary.uploader.upload(file.tempFilePath, options);
};

exports.uploadVideoToCloudniary = async (file, folder) => {
  const options = {
    resource_type: "video",
    folder,
  };
  return await cloudinary.uploader.upload(file.tempFilePath, options);
};
