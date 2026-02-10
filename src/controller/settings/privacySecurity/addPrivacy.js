import PrivacySecurity from "../../../model/privacySecurityModel.js";

const addPrivacy = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
      twoStepAuth,
      accountStatus,
      sessions
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword ||
      twoStepAuth === undefined ||
      !accountStatus ||
      !sessions
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    const newPrivacy = new PrivacySecurity({
      currentPassword,
      newPassword,
      confirmPassword,
      twoStepAuth,
      accountStatus,
      sessions
    });

    await newPrivacy.save();

    return res.status(201).json({
      success: true,
      message: "Privacy & Security settings saved successfully",
      data: newPrivacy
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

export default addPrivacy;
