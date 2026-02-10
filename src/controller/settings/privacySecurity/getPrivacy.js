import mongoose from "mongoose";
import privacySecurityModel from "../../../model/privacySecurityModel.js";

const getPrivacySecurityById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Check if ID is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    // ✅ Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    // ✅ Fetch record by ID
    const privacy = await privacySecurityModel.findById(id);

    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: "Settings not found",
      });
    }

    // ✅ If found
    res.status(200).json({
      success: true,
      message: "ID is present",
      data: privacy,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export default getPrivacySecurityById;
