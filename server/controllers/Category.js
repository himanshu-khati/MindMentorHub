const Category = require("../models/Category");
const Course = require("../models/Course");
// create category handler
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: `all fields are mandatory`,
      });
    }
    // save in db
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log("category details:", categoryDetails);
    return res.status(200).json({
      success: true,
      message: `category created successfully`,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `error creating token ${error.message}`,
    });
  }
};

// getAllcategory Controller

exports.getAllCategory = async (req, res) => {
  try {
    const allCategory = await Category.find(
      {},
      { name: true, description: true }
    );
    return res.status(200).json({
      success: true,
      message: "All categories are successfully fetched",
      allCategory,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong fetching category: ${error.message}`,
    });
  }
};

// category page details
exports.categoryPageDetails = async (req, res) => {
  try {
    // get category id
    const { categoryId } = req.body;
    // fetch  all courses associated with specified category id
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "published" },
        polulate: "ratingsAndReviews",
      })
      .exec();
    // validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: `data not found`,
      });
    }
    // get courses for different category
    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate("courses")
      .exec();
    // get top selling courses
    const topSellingCourses = await Course.find()
      .populate("studentsEnrolled")
      .sort((a, b) => b.studentsEnrolled.length - a.studentsEnrolled.length);

    // return response
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategories,
        topSellingCourses,
      },
    });
  } catch (error) {
    return res.status(201).json({
      success: false,
      message: `something went wrong fetching category page details: ${error.message}`,
    });
  }
};
