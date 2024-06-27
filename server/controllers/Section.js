const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

// create a section
exports.createSection = async (req, res) => {
  try {
    //fetch data
    const { sectionName, courseId } = req.body;
    // validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: `all fields are required`,
      });
    }
    // create section
    const newSection = await Section.create({ sectionName });
    // update course with section
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
    // return response
    return res.status(200).json({
      success: true,
      message: `section created sucessfully`,
      updatedCourseDetails,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong creatin section: ${error.message}`,
    });
  }
};

// update a section

exports.updateSection = async (req, res) => {
  try {
    // fetch data
    const { sectionName, sectionId, courseId } = req.body;
    // validate data
    if (!sectionName || !sectionId) {
      return res.status(401).json({
        success: false,
        message: `all fields are required`,
      });
    }
    // update data
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        sectionName,
      },
      {
        new: true,
      }
    );

    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
    // return response
    return res.status(200).json({
      success: false,
      message: `section updated successfully`,
      updatedSection,
      updatedCourse,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong updating section: ${error.message}`,
    });
  }
};

// delete a section
exports.deleteSection = async (req, res) => {
  try {
    //  fetch sectionid and courseId
    const { sectionId, courseId } = req.body;
    // find course details
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });

    //  fetch section details
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(401).json({
        success: false,
        message: `section not found`,
      });
    }
    // delete  subsection
    await SubSection.deleteMany({ _id: { $in: section.subSection } });
    // delete section
    await Section.findByIdAndDelete(sectionId);

    // find updated course
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: `section deleted successfully`,
      data: course,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong deleting section: ${error.message}`,
    });
  }
};
