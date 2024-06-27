const express = require("express");
const router = express.Router();
const {
  createCourse,
  editCourse,
  showAllCourses,
  getCourseDetails,
  deleteCourse,
  getFullCourseDetails,
  getInstructorCourses,
} = require("../controllers/Course");

const {
  categoryPageDetails,
  createCategory,
  getAllCategory,
} = require("../controllers/Category");

const {
  createSection,
  deleteSection,
  updateSection,
} = require("../controllers/Section");

const {
  createSubSection,
  deleteSubSection,
  updateSubsection,
} = require("../controllers/SubSection");

const {
  createRating,
  getAllRatingAndReviews,
  getAverageRating,
} = require("../controllers/RatingAndReview");

const { updateCourseProgress } = require("../controllers/CourseProgress");

const {
  auth,
  isAdmin,
  isInstructor,
  isStudent,
} = require("../middlewares/auth");

//* couse routes
// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse);
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection);
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection);
// Edit Sub Section
router.put("/updateSubSection", auth, isInstructor, updateSubsection);
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection);
// Get all Registered Courses
router.get("/getAllCourses", showAllCourses);
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails);
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse);
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
// Delete a Course
router.delete("/deleteCourse", deleteCourse);

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

//* Category routes (Only by Admin)
// Category can Only be Created by Admin

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", getAllCategory);
router.post("/getCategoryPageDetails", categoryPageDetails);

// * Rating and reviews
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatingAndReviews);

module.exports = router;
