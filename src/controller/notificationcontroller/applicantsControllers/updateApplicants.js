import Notification from "../../../model/notificationSchema.js";

const updateApplicants = async (req, res) => {
  try {
    const updatedApplicant = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        isSeen: req.body.isSeen ?? false, // default false if not provided
      },
      { new: true }
    );

    if (!updatedApplicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Applicant updated successfully",
      data: updatedApplicant,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export default updateApplicants;
