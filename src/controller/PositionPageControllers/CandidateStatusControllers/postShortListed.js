import Application from "../../../model/applicantSchema.js";
import Job from "../../../model/jobSchema.js";
import mongoose from "mongoose";
import { validateRequired } from "../../../utils/validateRequiredFields.js";

// POST /shortlist/:jobId - Shortlist a candidate for a specific job
export const postShortListed = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { 
      candidateId,
      reason = "",
      hiringManagerNotes = "",
      shortlistType = "Initial Screening"
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

    // Check if candidate is already shortlisted or rejected
    if (candidate.profileStatus === "Shortlisted") {
      return res.status(400).json({ 
        success: false,
        error: "Candidate is already shortlisted for this position"
      });
    }

    if (candidate.profileStatus === "Rejected") {
      return res.status(400).json({ 
        success: false,
        error: "Cannot shortlist a rejected candidate. Please update their status first."
      });
    }

    if (candidate.profileStatus === "Hired") {
      return res.status(400).json({ 
        success: false,
        error: "Candidate is already hired for this position"
      });
    }

    // Update candidate status to Shortlisted
    const previousStatus = candidate.profileStatus;
    candidate.profileStatus = "Shortlisted";
    candidate.candidateRating = "Good fit"; // Automatically set as good fit when shortlisted

    // Add shortlisting details
    candidate.shortlistingDetails = {
      shortlistType: shortlistType,
      shortlistedOn: new Date(),
      shortlistReason: reason,
      shortlistNotes: hiringManagerNotes
    };

    // Add any additional notes to feedback description
    if (hiringManagerNotes) {
      const existingDescription = candidate.candidateFeedback.feedbackDescription || "";
      const shortlistNote = `Shortlisted: ${hiringManagerNotes}`;
      candidate.candidateFeedback.feedbackDescription = existingDescription 
        ? `${existingDescription}\n\n${shortlistNote}` 
        : shortlistNote;
    }

    await candidate.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Candidate shortlisted successfully",
      data: {
        candidate: {
          candidateId: candidate._id,
          name: `${candidate.firstName} ${candidate.lastName}`,
          email: candidate.email,
          contactNumber: candidate.contactNumber,
          previousStatus: previousStatus,
          currentStatus: candidate.profileStatus,
          candidateRating: candidate.candidateRating,
          shortlistReason: reason,
          hiringManagerNotes: hiringManagerNotes
        },
        jobDetails: {
          jobId: job._id,
          jobTitle: job.jobTitle,
          department: job.department,
          hiringManager: job.hiringManager
        },
        shortlistedAt: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error("Error shortlisting candidate:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export default postShortListed;
