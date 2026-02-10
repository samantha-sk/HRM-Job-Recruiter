import notification from "../model/applicantsSchema.js";

export const addApplicant = async (req, res) => {
  try {
    const applicant = new notification({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    });
    await applicant.save();
    res.status(201).json({
      success: true,
      message: "Applicant added successfully",
      data: applicant
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const applicants = await notification.find();
    res.json({
      success: true,
      message: "Applicants fetched successfully",
      data: applicants
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
