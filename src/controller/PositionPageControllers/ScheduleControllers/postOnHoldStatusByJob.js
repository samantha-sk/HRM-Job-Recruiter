import Application from "../../../model/applicantSchema.js";
import InterviewSchedule from "../../../model/InterviewScheduleSchema.js";
import Job from "../../../model/jobSchema.js";
import mongoose from "mongoose";
import { validateRequired } from "../../../utils/validateRequiredFields.js";

// POST /onhold/:jobId - Put candidate on hold for a specific job
export const postOnHoldStatusByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { 
      candidateId, 
      scheduleId, 
      reason = "" 
    } = req.body;

    // require at least one identifier
    if (!candidateId && !scheduleId) {
      return res.status(400).json({ success: false, error: "Either candidateId or scheduleId is required" });
    }

    // Validate jobId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid jobId format" 
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

    // Check if we have either candidateId or scheduleId
    if (!candidateId && !scheduleId) {
      return res.status(400).json({ 
        success: false,
        error: "Either candidateId or scheduleId is required",
        message: "Provide candidateId for application or scheduleId for interview schedule"
      });
    }

    let responseData = {
      jobDetails: {
        jobId: job._id,
        jobTitle: job.jobTitle,
        department: job.department,
        hiringManager: job.hiringManager
      }
    };

    // If scheduleId is provided, update interview schedule status
    if (scheduleId) {
      if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
        return res.status(400).json({ 
          success: false,
          error: "Invalid scheduleId format" 
        });
      }

      const schedule = await InterviewSchedule.findById(scheduleId);
      if (!schedule) {
        return res.status(404).json({ 
          success: false,
          error: "Interview schedule not found"
        });
      }

      // Verify the schedule belongs to the job
      if (schedule.position !== job.jobTitle) {
        return res.status(400).json({ 
          success: false,
          error: "Schedule does not belong to this job position" 
        });
      }
      
      const previousStatus = schedule.status;
      schedule.status = "OnHold";
      await schedule.save();
      
      responseData.scheduleUpdate = {
        scheduleId: schedule._id,
        candidateName: schedule.candidateName,
        position: schedule.position,
        previousStatus: previousStatus,
        newStatus: "OnHold",
        interviewDate: schedule.interviewDate,
        interviewTime: schedule.interviewTime,
        reason: reason
      };
    }

    // If candidateId is provided, update application status
    if (candidateId) {
      if (!mongoose.Types.ObjectId.isValid(candidateId)) {
        return res.status(400).json({ 
          success: false,
          error: "Invalid candidateId format" 
        });
      }

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
      
      const previousStatus = candidate.profileStatus;
      candidate.profileStatus = "OnHold";
      await candidate.save();
      
      responseData.candidateUpdate = {
        candidateId: candidate._id,
        name: `${candidate.firstName} ${candidate.lastName}`,
        email: candidate.email,
        previousStatus: previousStatus,
        newStatus: "OnHold",
        reason: reason
      };
    }

    res.status(200).json({
      success: true,
      message: "Status updated to OnHold successfully",
      data: responseData
    });
    
  } catch (err) {
    console.error("Error updating status to OnHold:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export default postOnHoldStatusByJob;
