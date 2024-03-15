const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
// update profile controller
exports.updateProfile = async (req, res) => {
  try {
    // fetch data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
    // get user id
    const id = req.user.id;
    // validate
    if (!contactNumber || !gender || !id) {
      return res.status(401).json({
        success: false,
        message: `all fields are required`,
      });
    }
    // find  profile
    const userDetails = await User.findById(id);
    const profileId = userDetails?.additionalDetails;
    const profileDetails = await Profile.findById(profileId);
    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = contactNumber;
    await profileDetails.save();
    // return response
    return res.status(200).json({
      success: true,
      message: `profile updated successfully`,
      profileDetails,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong updating profile: ${error.message}`,
    });
  }
};

// delete account
exports.deleteAccount = async (req, res) => {
  try {
    // get userid
    const { id } = req.user;
    // validate
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: `user not found`,
      });
    }
    // delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
    // delete user
    await User.findByIdAndDelete({ _id: id });
    // delete student data from course
    const courses = userDetails.courses;
    //
    courses.map(async (courseId) => {
      await Course.findByIdAndUpdate(
        courseId,
        {
          $pull: {
            studentsEnrolled: id,
          },
        },
        {
          new: true,
        }
      );
    });
    // return response
    return res.status(200).json({
      success: false,
      message: `profile deleted successfully`,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong deleting user: ${error.message}`,
    });
  }
};

// get all user details

exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.user.id;
    const userDetails = await User.findById(id)
      .populate("additionalDetails", "courses")
      .exec();
    return res.status(200).json({
      success: true,
      message: `user data fetched successfully`,
      userDetails,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong fetching user details: ${error.message} `,
    });
  }
};
