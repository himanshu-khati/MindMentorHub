const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const {
  uploadImageToCloudinary,
  uploadVideoToCloudniary,
} = require("../utils/imageUploader");

//* create subsection
exports.createSubSection = async (req, res) => {
  try {
    // fetch data from req
    const { sectionId, title, description } = req.body;
    // fetch file
    const video = req.files.videoFile;
    // validate
    if (!sectionId || !title || !description || !video) {
      return res.status(404).json({
        success: false,
        message: `all fields are required`,
      });
    }
    // upload video
    const uploadDetails = await uploadVideoToCloudniary(
      video,
      process.env.FOLDER_NAME
    );
    // create subsection
    console.log("upload details:--- ", uploadDetails);
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });
    console.log("subSection:--- ", subSectionDetails);
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
    ).populate("subSection");
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
      message: `something went wrong updating Subsection: ${error.message}`,
    });
  }
};

//* update subsection
exports.updateSubsection = async (req, res) => {
  try {
    // fetch data
    const { sectionId, subSectionId, title, timeDuration, description } =
      req.body;
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // validate
    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }

    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    // find and update
    const updatedSubSection = await Section.findById(sectionId).populate(
      "subSection"
    );
    console.log("updated subsection: ", updatedSubSection);
    // return
    return res.status(200).json({
      success: false,
      message: `subsection updated successfully`,
      updatedSubSection,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong updating subsection: ${error.message}`,
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
    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });
    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" });
    }
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
