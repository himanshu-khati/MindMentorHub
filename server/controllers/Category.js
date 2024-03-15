const Category = require("../models/Category");
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
      success: false,
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
