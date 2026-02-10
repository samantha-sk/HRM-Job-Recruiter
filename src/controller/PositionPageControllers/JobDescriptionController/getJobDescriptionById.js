import Job from "../../../model/jobSchema.js";
import mongoose from "mongoose";

/**
 * @route GET /api/positions/job-description/:jobId
 * @desc Get job description details by job ID
 * @access Public
 * @param {string} jobId - The ID of the job
 * @returns {Object} Job description details including about, responsibilities, requirements, etc.
 */
const getJobDescriptionById = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Validate jobId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID format",
        error: "INVALID_JOB_ID"
      });
    }

    // Find job by ID and select only description-related fields
    const jobDescription = await Job.findById(jobId).select({
      // Basic job info
      jobTitle: 1,
      jobRole: 1,
      department: 1,
      jobLocation: 1,
      jobType: 1,
      hiringManager: 1,
      numberOfOpenings: 1,
      jobStatus: 1,
      closingDate: 1,
      postedOn: 1,
      
      // Job description fields
      about: 1,
      responsibilities: 1,
      requirements: 1,
      preferredQualifications: 1,
      lookingFor: 1,
      
      // Additional info
      applicationLink: 1,
      companyInfo: 1,
      posterVisuals: 1,
      
      createdAt: 1
    });

    // Check if job exists
    if (!jobDescription) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
        error: "JOB_NOT_FOUND"
      });
    }

    // Check if job is still active
    const isJobActive = jobDescription.jobStatus === "Open" && 
                       new Date(jobDescription.closingDate) > new Date();

    return res.status(200).json({
      success: true,
      message: "Job description retrieved successfully",
      data: {
        job: jobDescription,
        isActive: isJobActive,
        daysRemaining: isJobActive ? 
          Math.ceil((new Date(jobDescription.closingDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0
      }
    });

  } catch (error) {
    console.error("Error fetching job description:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching job description",
      error: "INTERNAL_SERVER_ERROR"
    });
  }
};

export default getJobDescriptionById;
