import  Notification  from "../../model/notificationSchema.js";

export const deleteApplicants = async (req, res) => {
  try {
    const deletedApplicants = await Notification.findByIdAndDelete(req.params.id);

    if (!deletedApplicants) {
      return res.status(404).json({ success: false, message: "Applicant not found" });
    }

    res.status(200).json({
      success: true,
      message: "Applicant deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};