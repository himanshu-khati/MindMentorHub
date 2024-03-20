const { mongoose } = require("mongoose");
const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
// const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");

//* capture the payment and initiate the razorpay order
exports.capturePayment = async (req, res) => {
  try {
    // get courseId, userId
    const { courseId } = req.body;
    const { userId } = req.user.id;
    // validation
    // validate courseId
    if (!courseId) {
      return res.status(401).json({
        success: false,
        message: `please provide valid courseId`,
      });
    }
    // validate courseDetail
    let course;
    try {
      course = await Course.findById(courseId);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: `course details not found`,
      });
    }
    // check id user already payed for the same course
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentsEnrolled.includes(uid)) {
      return res.status(401).json({
        success: false,
        message: `student already enrolled`,
      });
    }
    // create order
    const amount = course.price;
    const currency = "INR";
    const options = {
      amount: amount * 100,
      currency,
      reciept: Math.random(Date.now()).toString(),
      notes: {
        courseId: courseId,
        userId,
      },
    };
    try {
      // initiate the payment usinf razor pay
      const paymentResponse = await instance.orders.create(options);
      console.log("paymentResponse: ", paymentResponse);
      return res.status(200).json({
        success: true,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.amount,
        amount: paymentResponse.amount,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: `could not initate order`,
      });
    }

    // return response
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong while creating order: ${error.message}`,
    });
  }
};

//* Verify Signature

exports.verifySignature = async (req, res) => {
  try {
    const webhookSecret = "afjalkjfklasfiiffmafmeimfmasfmk";
    const signature = req.headers["x-razorpay-signature"];
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");
    if (signature === digest) {
      console.log(`payment is authorised`);
      const { courseId, userId } = req.body.payload.payment.entity.notes;
      try {
        // fullfill the action
        // find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          {
            $push: {
              studentsEnrolled: userId,
            },
          },
          {
            new: true,
          }
        );
        if (!enrolledCourse) {
          return res.status(500).json({
            success: false,
            message: `course not found`,
          });
        }
        console.log(enrolledCourse);

        // find the student and add course to their enrolled course
        const enrolledStudent = await User.findOneAndUpdate(
          { _id: userId },
          {
            $push: {
              courses: courseId,
            },
          },
          {
            new: true,
          }
        );
        console.log("enrolledStudent: ", enrolledStudent);
        //send an email to enrolled student
        const emailResponse = await mailSender(
          enrolledStudent.email,
          "enrolled to course",
          "congrtulations, you are onboarded into new mindmentor course"
        );
        console.log(emailResponse);
        return res.status(200).json({
          success: true,
          message: " signature verified and course added",
        });
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: error.message,
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: `signature not matched`,
      });
    }
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong verifying signature and adding student to course : ${error.message}`,
    });
  }
};
