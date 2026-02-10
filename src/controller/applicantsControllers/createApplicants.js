import Notification from "../../model/notificationSchema.js";

export const createApplicants = async (req, res) => {
  try {
    const applicants = new Notification({
      type: "applicants",
      applicantId: req.body.applicantId, 
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
      isSeen: true,
      isFavourite: true
    });

    await applicants.save();

    res.status(201).json({
      success: true,
      message: "Applicant added successfully",
      data: applicants
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};