const express = require("express");
const router = express.Router();
const { auth, isInstructor } = require("../middlewares/auth");
const {
  deleteAccount,
  getEnrolledCourses,
  getUserDetails,
  instructorDashboard,
  updateProfile,
  updateProfilePicture,
} = require("../controllers/Profile");

// Profile Routes

// Delet User Account
router.delete("/deleteProfile", auth, deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getUserDetails);
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateDisplayPicture", auth, updateProfilePicture);
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

module.exports = router;
