import Application from "../../../model/applicantSchema.js";
import Job from "../../../model/jobSchema.js";
import mongoose from "mongoose";
import { validateRequired } from "../../../utils/validateRequiredFields.js";

// POST /feedback/:jobId - Post feedback for a candidate for a specific job
export const postFeedbackByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { 
      candidateId,
      candidateFeedback = {},
      candidateRating,
      updateStatus = false,
      newStatus = null
    } = req.body;

    // Destructure feedback fields
    const {
      communication,
      technical,
      programming,
      problemSolving,
      feedbackDescription
    } = candidateFeedback;

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

    // Validate feedback enum values
    const validRatings = ["Excellent", "Good", "Below Average", "Inadequate"];
    const validCandidateRatings = ["Good fit", "Not a fit", "Maybe"];

    if (communication && !validRatings.includes(communication)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid communication rating. Must be one of: Excellent, Good, Below Average, Inadequate" 
      });
    }

    if (technical && !validRatings.includes(technical)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid technical rating. Must be one of: Excellent, Good, Below Average, Inadequate" 
      });
    }

    if (programming && !validRatings.includes(programming)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid programming rating. Must be one of: Excellent, Good, Below Average, Inadequate" 
      });
    }

    if (problemSolving && !validRatings.includes(problemSolving)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid problem solving rating. Must be one of: Excellent, Good, Below Average, Inadequate" 
      });
    }

    if (candidateRating && !validCandidateRatings.includes(candidateRating)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid candidate rating. Must be one of: Good fit, Not a fit, Maybe" 
      });
    }

    if (newStatus && updateStatus) {
      const validStatuses = ["Applied", "Shortlisted", "Rejected", "OnHold", "Interview", "Hired", "Rescheduled"];
      if (!validStatuses.includes(newStatus)) {
        return res.status(400).json({ 
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` 
        });
      }
    }

    // Update candidate feedback
    const previousFeedback = candidate.candidateFeedback;
    const previousRating = candidate.candidateRating;
    const previousStatus = candidate.profileStatus;

    candidate.candidateFeedback = {
      communication: communication || candidate.candidateFeedback.communication,
      technical: technical || candidate.candidateFeedback.technical,
      programming: programming || candidate.candidateFeedback.programming,
      problemSolving: problemSolving || candidate.candidateFeedback.problemSolving,
      feedbackDescription: feedbackDescription !== undefined ? feedbackDescription : candidate.candidateFeedback.feedbackDescription
    };

    // Update candidate rating if provided
    if (candidateRating) {
      candidate.candidateRating = candidateRating;
    }

    // Update status if requested
    if (updateStatus && newStatus) {
      candidate.profileStatus = newStatus;
    }

   await candidate.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Candidate feedback posted successfully",
      data: {
        candidate: {
          candidateId: candidate._id,
          name: `${candidate.firstName} ${candidate.lastName}`,
          email: candidate.email,
          previousFeedback: previousFeedback,
          updatedFeedback: candidate.candidateFeedback,
          previousRating: previousRating,
          updatedRating: candidate.candidateRating,
          previousStatus: previousStatus,
          currentStatus: candidate.profileStatus
        },
        jobDetails: {
          jobId: job._id,
          jobTitle: job.jobTitle,
          department: job.department,
          hiringManager: job.hiringManager
        }
      }
    });

  } catch (err) {
    console.error("Error posting candidate feedback:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export default postFeedbackByJob;
