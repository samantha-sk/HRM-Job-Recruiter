import Profile from "../../../model/profileModel.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const addProfile = async (req, res) => {
  try {
    const { firstName, lastName, contactNumber, role, department } = req.body;
    let uploadedPhoto = "";
    if (req.files && req.files.profilePhoto) {
      const file = req.files.profilePhoto;
      const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "profiles",
        resource_type: "image",
      });
      uploadedPhoto = uploadResult.secure_url;
    }
    if (!firstName || !lastName || !contactNumber || !role || !department || !uploadedPhoto) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const newProfile = new Profile({
      firstName,
      lastName,
      contactNumber,
      role,
      department,
      profilePhoto: uploadedPhoto,
    });

    await newProfile.save();

    res.status(201).json({
      success: true,
      message: "Profile saved successfully",
      data: newProfile,
    });
  } catch (error) {
    console.error("Error in addProfile:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export default addProfile;
