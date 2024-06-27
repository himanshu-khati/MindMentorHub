const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");

exports.updateCourseProgress = async (req, res) => {
  try {
    const { courseId, subSectionId } = req.body;
    const { id } = req.user;
    const subsection = await SubSection.findById(subSectionId);
    if (!subsection) {
      return res.status(401).json({
        success: false,
        message: `sunsection not found`,
      });
    }
    const courseProgress = await CourseProgress.findOne({
      courseId: courseId,
      userId: id,
    });
    console.log("courseProgress--", courseProgress)

    if (!courseProgress) {
      return res.status(401).json({
        success: false,
        message: `course progress not found`,
      });
    } else {
      if (courseProgress.completedVideos.includes(subSectionId)) {
        return res.status(401).json({
          success: false,
          message: `subsection already completd`,
        });
      }
      courseProgress.completedVideos.push(subsectionId);
    }
    await courseProgress.save();
    return res.status(200).json({
      success: true,
      message: `course progress updated`,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: `something went wrong updating course: ${error.message}`,
    });
  }
};
