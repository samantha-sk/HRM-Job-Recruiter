import Application from "../../../model/applicantSchema.js";
import InterviewSchedule from "../../../model/InterviewScheduleSchema.js";
import Job from "../../../model/jobSchema.js";
import mongoose from "mongoose";
import { validateRequired } from "../../../utils/validateRequiredFields.js";

// POST /reschedule/:jobId - Reschedule interview for a candidate for a specific job
export const postRescheduleByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { 
      candidateId, 
      scheduleId, 
      newDate, 
      newTime, 
      reason = "" 
    } = req.body;

    const missing = validateRequired(["scheduleId","newDate","newTime"], req.body);
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

    // Validate scheduleId
    if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid scheduleId format" 
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

    // Find the interview schedule
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

    // Find candidate if candidateId is provided
    let candidate = null;
    if (candidateId) {
      if (!mongoose.Types.ObjectId.isValid(candidateId)) {
        return res.status(400).json({ 
          success: false,
          error: "Invalid candidateId format" 
        });
      }

      candidate = await Application.findOne({
        _id: candidateId,
        jobId: jobId
      });

      if (!candidate) {
        return res.status(404).json({ 
          success: false,
          error: "Candidate not found for this job" 
        });
      }

      // Verify candidate name matches schedule
      const candidateName = `${candidate.firstName} ${candidate.lastName}`;
      if (schedule.candidateName !== candidateName) {
        return res.status(400).json({ 
          success: false,
          error: "Candidate does not match the interview schedule" 
        });
      }
    }

    // Store previous schedule information
    const previousSchedule = {
      interviewDate: schedule.interviewDate,
      interviewTime: schedule.interviewTime,
      updatedAt: new Date().toISOString(),
      reason: reason
    };

    // Update schedule with new date and time
    schedule.rescheduled = true;
    schedule.previousSchedule = previousSchedule;
    schedule.interviewDate = newDate;
    schedule.interviewTime = newTime;
    schedule.status = "Rescheduled";

    await schedule.save();

    // Update candidate status to Rescheduled if candidate found
    if (candidate) {
      candidate.profileStatus = "Rescheduled";
      await candidate.save();
    }

    res.status(200).json({
      success: true,
      message: "Interview rescheduled successfully",
      data: {
        schedule: {
          scheduleId: schedule._id,
          candidateName: schedule.candidateName,
          position: schedule.position,
          recruiterName: schedule.recruiterName,
          newInterviewDate: schedule.interviewDate,
          newInterviewTime: schedule.interviewTime,
          previousSchedule: schedule.previousSchedule,
          meetingMode: schedule.meetingMode,
          status: schedule.status
        },
        candidateStatus: candidate ? candidate.profileStatus : null,
        jobDetails: {
          jobId: job._id,
          jobTitle: job.jobTitle,
          department: job.department,
          hiringManager: job.hiringManager
        }
      }
    });
  } catch (err) {
    console.error("Error rescheduling interview:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export default postRescheduleByJob;
