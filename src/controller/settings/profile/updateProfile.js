import profileModel from "../../../model/profileModel.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProfile = await profileModel.findById(id);
    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    let updateData = { ...req.body };
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "uploads"
      });
      updateData.profilePhoto = uploadResult.secure_url;
    }
    const requiredFields = ["firstName", "lastName", "contactNumber", "role", "department", "profilePhoto"];
    const missingFields = requiredFields.filter(field => !updateData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        missingFields
      });
    }
    const updatedProfile = await profileModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export default updateProfile;
