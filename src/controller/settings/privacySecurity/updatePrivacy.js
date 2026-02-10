import mongoose from "mongoose";
import privacySecurityModel from "../../../model/privacySecurityModel.js";

const updatePrivacySecurity = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }
    const { currentPassword, newPassword, confirmPassword, twoStepAuth, accountStatus, sessions } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword ||
      twoStepAuth === undefined ||
      !accountStatus ||
      sessions === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const updatedPrivacy = await privacySecurityModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedPrivacy) {
      return res.status(404).json({
        success: false,
        message: "Settings not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Privacy settings updated successfully",
      data: updatedPrivacy,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export default updatePrivacySecurity;
