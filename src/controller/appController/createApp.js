import mongoose from "mongoose";
import Application from "../../model/applicantSchema.js";
import Job from "../../model/jobSchema.js";
import validator from "validator";

const createApplication = async (req, res) => {
  try {
    let {
      firstName, middleName, lastName,
      address1, address2, city, state, country, postalCode,
      email, contactNumber,
      gender, experienceLevel,
      education, experience,
      skills, attachments,
      referralSource,
      consent, termsAccepted,
      jobId
    } = req.body;

    email = typeof email === "string" ? email.toLowerCase().trim() : email;
    contactNumber = typeof contactNumber === "string" ? contactNumber.replace(/\D/g, "") : contactNumber;

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (
      !firstName || !lastName || !address1 || !address2 ||
      !city || !state || !country || !postalCode ||
      !email || !contactNumber || !gender || !experienceLevel ||
      !education || !Array.isArray(education) || education.length === 0 ||
      !skills || !Array.isArray(skills) || skills.length === 0 ||
      !referralSource ||
      termsAccepted === undefined || termsAccepted === null ||
      !jobId
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, message: "Invalid jobId format" });
    }

    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
      return res.status(404).json({
        success: false,
        message: "Job not found. Cannot apply to a non-existent job",
      });
    }

    
    const existingApplication = await Application.findOne({ jobId, email });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job with this email", // Prevents multiple applications for same jobId + email
      });
    }

    const newApplication = new Application({
      firstName, middleName, lastName,
      address1, address2, city, state, country, postalCode,
      email, contactNumber,
      gender, experienceLevel,
      education, experience,
      skills, attachments,
      referralSource,
      consent, termsAccepted,
      jobId
    });

    await newApplication.save();

    return res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: newApplication,
    });
  } catch (err) {
    console.error("Create Application Error:", err.message);

    if (err.name === "ValidationError") {
      const fields = Object.keys(err.errors || {});
      return res.status(400).json({
        success: false,
        message: `Validation failed for: ${fields.join(", ") || "payload"}`,
      });
    }

    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid data type provided" });
    }

    if (err.code === 11000) {
      const dupFields = Object.keys(err.keyValue || {}).join(", ");
      return res.status(400).json({ success: false, message: `Duplicate field(s): ${dupFields}` });
    }

    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default createApplication;