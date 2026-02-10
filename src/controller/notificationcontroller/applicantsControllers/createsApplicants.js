import Notification from "../../../model/notificationSchema.js";

const createApplicants = async (req, res) => {
  try {
    const { applicantId, name, email, phone, message } = req.body;

    // ✅ Validate required fields
    if (!applicantId || !name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "ApplicantId, name, email, and phone are required",
      });
    }

    const applicant = new Notification({
      type: "applicants",
      applicantId,
      name,
      email,
      phone,
      message: message || "",
      isSeen: false,
      isFavourite: false,
    });

    await applicant.save();

    res.status(201).json({
      success: true,
      message: "Applicant added successfully",
      data: applicant,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export default createApplicants;
