import Application from "../../../model/applicantSchema.js";
import Job from "../../../model/jobSchema.js";
import mongoose from "mongoose";
import { validateRequired } from "../../../utils/validateRequiredFields.js";

// POST /hired/:jobId - Mark a candidate as hired for a specific job
export const postHired = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { 
      candidateId,
      salary = null,
      startDate = null,
      hiringNotes = "",
      offerLetterSent = false
    } = req.body;

    const missing = validateRequired(["candidateId"], req.body);
    if (missing.length) {
      return res.status(400).json({ success: false, error: `Missing required fields: ${missing.join(", ")}` });
    }

    // Validate jobId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid jobId format" 
      });
    }

    // Validate candidateId
    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid candidateId format" 
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ 
        success: false,
        error: "Job not found" 
      });
    }

    // Find candidate for this specific job
    const candidate = await Application.findOne({
      _id: candidateId,
      jobId: jobId
    });

    if (!candidate) {
      return res.status(404).json({ 
        success: false,
        error: "Candidate not found for this job"
      });
    }

    // Check if candidate is already hired
    if (candidate.profileStatus === "Hired") {
      return res.status(400).json({ 
        success: false,
        error: "Candidate is already hired for this position"
      });
    }

    // Check if candidate is rejected
    if (candidate.profileStatus === "Rejected") {
      return res.status(400).json({ 
        success: false,
        error: "Cannot hire a rejected candidate. Please update their status first."
      });
    }

    // Validate salary if provided
    if (salary && (typeof salary !== 'number' || salary <= 0)) {
      return res.status(400).json({ 
        success: false,
        error: "Salary must be a positive number" 
      });
    }

    // Validate start date if provided
    if (startDate && !Date.parse(startDate)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid start date format. Please use YYYY-MM-DD format" 
      });
    }

    // Update candidate status to Hired
    const previousStatus = candidate.profileStatus;
    candidate.profileStatus = "Hired";
    candidate.candidateRating = "Good fit"; // Automatically set as good fit when hired

    // Add hiring details
    candidate.hiringDetails = {
      hiredOn: new Date(),
      salary: salary,
      startDate: startDate ? new Date(startDate) : null,
      hiringNotes: hiringNotes,
      offerLetterSent: offerLetterSent
    };

    // Add hiring notes to feedback description if provided
    if (hiringNotes) {
      const existingDescription = candidate.candidateFeedback.feedbackDescription || "";
      const hiredNote = `Hired: ${hiringNotes}`;
      candidate.candidateFeedback.feedbackDescription = existingDescription 
        ? `${existingDescription}\\n\\n${hiredNote}` 
        : hiredNote;
    }

    await candidate.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Candidate hired successfully",
      data: {
        candidate: {
          candidateId: candidate._id,
          name: `${candidate.firstName} ${candidate.lastName}`,
          email: candidate.email,
          contactNumber: candidate.contactNumber,
          previousStatus: previousStatus,
          currentStatus: candidate.profileStatus,
          candidateRating: candidate.candidateRating,
          hiringDetails: {
            hiredOn: candidate.hiringDetails.hiredOn,
            salary: candidate.hiringDetails.salary,
            startDate: candidate.hiringDetails.startDate,
            hiringNotes: candidate.hiringDetails.hiringNotes,
            offerLetterSent: candidate.hiringDetails.offerLetterSent
          }
        },
        jobDetails: {
          jobId: job._id,
          jobTitle: job.jobTitle,
          department: job.department,
          hiringManager: job.hiringManager
        },
        hiredAt: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error("Error hiring candidate:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export default postHired;