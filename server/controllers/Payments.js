const { mongoose } = require("mongoose");
const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");
// const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");

//* capture the payment and initiate the razorpay order
exports.capturePayment = async (req, res) => {
  try {
    // get courseId, userId
    const { courses } = req.body;
    const userId = req.user.id;
    // validation
    // validate courseId
    console.log("courses--->", courses);
    if (courses.length === 0) {
      return res.json({ success: false, message: "Please Provide Course ID" });
    }
    let totalAmount = 0;
    // validate courseDetail
    for (const courseId of courses) {
      let course;
      try {
        course = await Course.findById(courseId);
        if (!course) {
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
        totalAmount += course.price;
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: `something went wrong ${error.message}`,
        });
      }
    }
    // create order

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      reciept: Math.random(Date.now()).toString(),
    };
    try {
      // initiate the payment using razor pay
      const paymentResponse = await instance.orders.create(options);
      console.log("paymentResponse: ", paymentResponse);
      return res.status(200).json({
        success: true,
        data: paymentResponse,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: `could not initate order`,
      });
    }
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong while creating order: ${error.message}`,
    });
  }
};

// verify the payment
exports.verifyPayment = async (req, res) => {
  try {
    const razorpayOrderId = req.body?.razorpay_order_id;
    const razorpayPaymentId = req.body?.razorpay_payment_id;
    const razorpaySignature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;
    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature ||
      !courses ||
      !userId
    ) {
      return res.status(200).json({
        success: false,
        messsage: `payment failed`,
      });
    }
    let body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");
    if (expectedSignature === razorpaySignature) {
      await enrollStudents(courses, userId, res);
      return res.status(200).json({
        success: true,
        message: `payment verified`,
      });
    }
    return res.status(200).json({
      success: false,
      message: `payment failed`,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong veryfying payment ${error.message}`,
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

// send payment successful email
exports.sendPaymentSuccessEmail = async (req, res) => {
  try {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
      return res.status(404).json({
        success: false,
        message: `all fields are required`,
      });
    }
    const enrolledStudent = await User.findById(userId);
    await mailSender(
      enrolledStudent.email,
      `payment recieved`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `error sending email ${error.message}`,
    });
  }
};

// enroll the student in the course
const enrollStudents = async (courses, userId, res) => {
  try {
    if (!courses || !userId) {
      return res.status(400).json({
        success: false,
        message: `please provide courseId and userId`,
      });
    }
    for (const courseId of courses) {
      const enrolledCourse = await Course.findOneAndUpdate(
        {
          _id: courseId,
        },
        { $push: { studentsEnroled: userId } },
        { new: true }
      );
      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          error: "course not found",
        });
      }
      console.log("Updated course: ", enrolledCourse);
      const courseProgress = await CourseProgress.create({
        courseId: courseId,
        userId: userId,
        completedVideos: [],
      });
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );
      console.log("Enrolled student: ", enrolledStudent);
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      );
      console.log("Email sent successfully: ", emailResponse.response);
    }
  } catch (error) {
    return res.status(200).json({
      success: false,
      error: `something went wrong ${error.message}`,
    });
  }
};
