import Notification from "../../../model/notificationSchema.js";

const markApplicantsAsSeen = async (req, res) => {
  try {
    const updatedApplicant = await Notification.findByIdAndUpdate(
      req.params.id,
      { isSeen: true },
      { new: true }
    );

    if (!updatedApplicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Applicant notification marked as seen",
      data: updatedApplicant,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export default markApplicantsAsSeen;
