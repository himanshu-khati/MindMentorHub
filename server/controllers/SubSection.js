const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//* create subsection
exports.createSubSection = async (req, res) => {
  try {
    // fetch data from req
    const { sectionId, title, timeDuration, description } = req.body;
    // fetch file
    const video = req.files.videoFile;
    // validate
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(401).json({
        success: false,
        message: `all fields are required`,
      });
    }
    // upload video
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    // create subsection
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });
    // save section with subsection id
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      {
        new: true,
      }
    )
      .populate("subSection")
      .exec();
    console.log("updatedSection: ", updatedSection);
    // return response
    return res.status(200).json({
      success: true,
      message: `sub section created successfully`,
      updatedSection,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong updating Subsection: ${error.mesage}`,
    });
  }
};

//* update subsection
exports.updatedSection = async (req, res) => {
  try {
    // fetch data
    const { sectionId, subSectionId, title, timeDuration, description } =
      req.body;
    // fetch video
    const video = req.files.videoFile;
    // validate
    if (
      !sectionId ||
      !subSectionId ||
      !title ||
      !description ||
      !video ||
      !timeDuration
    ) {
      return res.status(401).json({
        success: false,
        message: `all fields are required`,
      });
    }
    ({
      success: false,
      message: `section updated successfully`,
      updatedSection,
    });
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    // find and update
    const updatedSubsection = await SubSection.findByIdAndUpdate(subSectionId, {
      title: title,
      description: description,
      timeDuration: timeDuration,
      videoUrl: uploadDetails.secure_url,
    });
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );
    console.log("updated section: ", updatedSection);
    // return
    return res.status(200).json({
      success: false,
      message: `section updated successfully`,
      updatedSection,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong updating section: ${error.mesage}`,
    });
  }
};

//*  delete subsection
exports.deleteSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId } = req.body;
    if (!sectionId || !subSectionId) {
      return res.status(401).json({
        success: true,
        message: `subSectionId or sectionId not found`,
      });
    }
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subsection: subSectionId,
        },
      }
    );
    await SubSection.findByIdAndDelete({ _id: subSectionId });
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );
    return res.status(201).json({
      sucess: true,
      message: `subsection deleted successfully`,
      data: updatedSection,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong deleting subsection: ${error.message}`,
    });
  }
};
