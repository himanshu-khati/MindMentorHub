const Tag = require("../models/Tag");

// createTag handler
exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: `all fields are mandatory`,
      });
    }
    // save in db
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log("tag details:", tagDetails);
    return res.status(200).json({
      success: false,
      message: `tag created successfully`,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `error creating token ${error.message}`,
    });
  }
};

// getAllTags Controller

exports.getAllTags = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: true, description: true });
    return res.status(200).json({
      success: true,
      message: "All Tags are successfully fetched",
      allTags,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong fetching tags: ${error.message}`,
    });
  }
};
