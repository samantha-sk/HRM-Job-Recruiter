import Notification from "../../../model/notificationSchema.js";

const deleteApplicants = async (req, res) => {
  try {
    const deletedApplicant = await Notification.findByIdAndDelete(req.params.id);

    if (!deletedApplicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Applicant deleted successfully",
      data: deletedApplicant,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export default deleteApplicants;
