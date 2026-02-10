import Application from "../../../model/applicantSchema.js";
import InterviewSchedule from "../../../model/InterviewScheduleSchema.js";
import Job from "../../../model/jobSchema.js";
import mongoose from "mongoose";
import { validateRequired } from "../../../utils/validateRequiredFields.js";

// POST /schedule/:jobId - Schedule interview for a candidate for a specific job
export const postScheduleByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { 
      candidateId, 
      recruiterName, 
      interviewDate, 
      interviewTime, 
      meetingMode, 
      durationMinutes = 30, 
      sendNotification = false 
    } = req.body;

    // required fields presence check
    const missing = validateRequired(["candidateId","recruiterName","interviewDate","interviewTime","meetingMode"], req.body);
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

    // Check if candidate exists and is applying for this job
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

    // Check if candidate already has an active interview scheduled (not completed/cancelled)
    const existingActiveSchedule = await InterviewSchedule.findOne({
      candidateName: `${candidate.firstName} ${candidate.lastName}`,
      position: job.jobTitle,
      status: { $in: ['Scheduled', 'OnHold', 'Rescheduled'] }
    });

    if (existingActiveSchedule) {
      return res.status(400).json({ 
        success: false,
        error: "Interview already scheduled for this candidate. Please complete or cancel the existing interview first.",
        existingSchedule: {
          scheduleId: existingActiveSchedule._id,
          date: existingActiveSchedule.interviewDate,
          time: existingActiveSchedule.interviewTime,
          status: existingActiveSchedule.status
        }
      });
    }

    // Create interview schedule
    const schedule = new InterviewSchedule({
      candidateName: `${candidate.firstName} ${candidate.lastName}`,
      position: job.jobTitle,
      recruiterName,
      interviewDate,
      interviewTime,
      meetingMode,
      durationMinutes,
      sendNotification,
      status: 'Scheduled'
    });

    await schedule.save();

    // Update candidate status to Interview
    candidate.profileStatus = "Interview";
    await candidate.save();

    res.status(201).json({
      success: true,
      message: "Interview scheduled successfully",
      data: {
        schedule: {
          scheduleId: schedule._id,
          candidateName: schedule.candidateName,
          candidateEmail: candidate.email,
          position: schedule.position,
          recruiterName: schedule.recruiterName,
          interviewDate: schedule.interviewDate,
          interviewTime: schedule.interviewTime,
          meetingMode: schedule.meetingMode,
          duration: schedule.durationMinutes
        },
        candidateStatus: candidate.profileStatus,
        jobDetails: {
          jobId: job._id,
          jobTitle: job.jobTitle,
          department: job.department,
          hiringManager: job.hiringManager
        }
      }
    });
  } catch (err) {
    console.error("Error scheduling interview:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export default postScheduleByJob;
