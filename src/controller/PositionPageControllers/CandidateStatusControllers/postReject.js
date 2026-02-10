import Application from "../../../model/applicantSchema.js";
import Job from "../../../model/jobSchema.js";
import InterviewSchedule from "../../../model/InterviewScheduleSchema.js";
import mongoose from "mongoose";
import { validateRequired } from "../../../utils/validateRequiredFields.js";

// POST /reject/:jobId - Reject a candidate for a specific job
export const postReject = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { 
      candidateId,
      rejectionReason = "",
      hiringManagerNotes = "",
      cancelInterview = true
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

    // Check if candidate is already rejected
    if (candidate.profileStatus === "Rejected") {
      return res.status(400).json({ 
        success: false,
        error: "Candidate is already rejected for this position"
      });
    }

    // Check if candidate is already hired
    if (candidate.profileStatus === "Hired") {
      return res.status(400).json({ 
        success: false,
        error: "Cannot reject a hired candidate"
      });
    }

    // Update candidate status to Rejected
    const previousStatus = candidate.profileStatus;
    candidate.profileStatus = "Rejected";
    candidate.candidateRating = "Not a fit"; // Automatically set as not a fit when rejected

    // Add rejection notes to feedback description
    const rejectionNote = `Rejected: ${rejectionReason}${hiringManagerNotes ? ` - ${hiringManagerNotes}` : ''}`;
    const existingDescription = candidate.candidateFeedback.feedbackDescription || "";
    candidate.candidateFeedback.feedbackDescription = existingDescription 
      ? `${existingDescription}\n\n${rejectionNote}` 
      : rejectionNote;

    await candidate.save({ validateBeforeSave: false });

    let interviewCancellationInfo = null;

    // Cancel interview if requested and candidate had an interview scheduled
    if (cancelInterview && (previousStatus === "Interview" || previousStatus === "Rescheduled")) {
      const interviewSchedule = await InterviewSchedule.findOne({
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        position: job.jobTitle
      });

      if (interviewSchedule) {
        interviewSchedule.status = "Cancelled";
        await interviewSchedule.save();
        
        interviewCancellationInfo = {
          scheduleId: interviewSchedule._id,
          interviewDate: interviewSchedule.interviewDate,
          interviewTime: interviewSchedule.interviewTime,
          status: "Cancelled"
        };
      }
    }

    res.status(200).json({
      success: true,
      message: "Candidate rejected successfully",
      data: {
        candidate: {
          candidateId: candidate._id,
          name: `${candidate.firstName} ${candidate.lastName}`,
          email: candidate.email,
          contactNumber: candidate.contactNumber,
          previousStatus: previousStatus,
          currentStatus: candidate.profileStatus,
          candidateRating: candidate.candidateRating,
          rejectionReason: rejectionReason,
          hiringManagerNotes: hiringManagerNotes
        },
        jobDetails: {
          jobId: job._id,
          jobTitle: job.jobTitle,
          department: job.department,
          hiringManager: job.hiringManager
        },
        interviewCancellation: interviewCancellationInfo,
        rejectedAt: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error("Error rejecting candidate:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export default postReject;
