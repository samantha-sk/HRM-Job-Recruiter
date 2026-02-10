import Notification from "../../../model/notificationSchema.js";

const getApplicants = async (req, res) => {
  try {
    const { id } = req.params;

    let applicantList;

    if (id) {
      // 🔹 Fetch single applicant by ID
      applicantList = await Notification.findOne({ _id: id, type: "applicants" })
        .populate("applicantId");

      if (!applicantList) {
        return res.status(404).json({
          success: false,
          message: "Applicant not found",
        });
      }
    } else {
      // 🔹 Fetch all applicants
      applicantList = await Notification.find({ type: "applicants" })
        .populate("applicantId");
    }

    res.status(200).json({
      success: true,
      message: "Applicants fetched successfully",
      data: applicantList,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export default getApplicants;
