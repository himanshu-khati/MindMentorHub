const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { mongoose } = require("mongoose");

// create rating and review
exports.createRating = async (req, res) => {
  try {
    // get user id
    const userId = req.user.id;
    // fetch data from req body
    const { rating, review, courseId } = req.body;
    //check if user is enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        mesage: `user is not enrolled in course`,
      });
    }
    // check if user already reviewed course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: `course is already reviewed by the user`,
      });
    }
    //  create rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });
    // update course with review
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      {
        new: true,
      }
    );
    console.log(updatedCourseDetails);
    // return response
    return res.status(200).json({
      success: true,
      message: ` rating and review created successfully`,
      ratingReview,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong while creating rating and review: ${error.message}`,
    });
  }
};

// get average ratings
exports.getAverageRating = async (req, res) => {
  try {
    // get course id
    const { courseId } = req.body;
    // calulate average rating
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    // return rating
    if (result.length > 0) {
      return res.status(201).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }
    // if no ratings are found
    return res.status(201).json({
      success: true,
      message: `average rating is 0 till now, no rating given`,
      averageRating: 0,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong fetching average rating: ${error.message}`,
    });
  }
};

// get all rating and reviews
/*
exports.getAllRatingAndReviews = async (req, res) => {
  try {
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong fetching all ratings and reviews`,
    });
  }
};
*/
