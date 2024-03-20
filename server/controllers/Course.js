const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create course handler
exports.createCourse = async (req, res) => {
  try {
    // get data from request
    const {
      courseSchema,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
    } = req.body;
    //   get thumbnail
    const thumbnail = req.files.thumbnailImage;
    // validation
    if (
      !courseSchema ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category
    ) {
      return res.status(401).json({
        success: false,
        message: ` all fields are mandatory`,
      });
    }
    // check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("instructor details: ", instructorDetails);
    if (!instructorDetails) {
      return res.status(401).json({
        success: false,
        message: `instructor details not found`,
      });
    }
    // check given categor valid or not
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(401).json({
        success: false,
        message: `Category details not found`,
      });
    }

    // upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    //add new course to user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      {
        new: true,
      }
    );

    // update category schema
    await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
      { $push: { course: newCourse._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "course created successfully",
      data: newCourse,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wring while creating course ${error.message}`,
    });
  }
};

//* get all courses

exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();
    return res.status(200).json({
      success: true,
      message: `data for all courses fetched successfully`,
      data: allCourses,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong fetching courses: ${error.message}`,
    });
  }
};

//* get course details
exports.getCourseDetails = async (req, res) => {
  try {
    // get course id
    const { courseId } = req.body;
    // find course details
    const courseDetails = await Course.findById({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
    // validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `could not find the course with  ${courseId}`,
      });
    }
    // return response
    return res.status(201).json({
      success: true,
      message: `course details fetched successfully`,
      data: courseDetails,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong geting course data ${error.message}`,
    });
  }
};
