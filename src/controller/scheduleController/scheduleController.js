import Application from "../../model/applicantSchema.js";
import InterviewSchedule from "../../model/InterviewScheduleSchema.js";
import mongoose from "mongoose";

// GET /applied
export const getAppliedCandidates = async (req, res) => {
  try {
    const candidates = await Application.find({ profileStatus: "Applied" });
    const result = candidates.map(c => ({
      name: `${c.firstName} ${c.lastName}`,
      appliedDate: c.createdAt,
      profileView: c.profileView,
      profileStatus: c.profileStatus
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /selected
export const getSelectedCandidates = async (req, res) => {
  try {
    const candidates = await Application.find({ profileStatus: "Selected" });
    const result = candidates.map(c => ({
      name: `${c.firstName} ${c.lastName}`,
      submitted: c.createdAt,
      profileView: c.profileView,
      profileStatus: c.profileStatus
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /interview
export const getInterviewCandidates = async (req, res) => {
  try {
    const candidates = await Application.find({ profileStatus: "Interview" });
    // Find interview schedule for each candidate
    const result = await Promise.all(candidates.map(async c => {
      // Find schedule by candidate name
      const schedule = await InterviewSchedule.findOne({ candidateName: `${c.firstName} ${c.lastName}` });
      return {
        name: `${c.firstName} ${c.lastName}`,
        profileView: c.profileView,
        profileStatus: c.profileStatus,
        schedule: schedule || null
      };
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /schedule
export const getScheduleCandidates = async (req, res) => {
  try {
    const schedules = await InterviewSchedule.find();
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /onhold
export const getOnHoldCandidates = async (req, res) => {
  try {
    const candidates = await Application.find({ profileStatus: "OnHold" });
    const result = candidates.map(c => ({
      name: `${c.firstName} ${c.lastName}`,
      interviewDateTime: c.interviewDateTime || null,
      profileView: c.profileView
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /onreschedule
export const getOnRescheduleCandidates = async (req, res) => {
  try {
    const schedules = await InterviewSchedule.find({ rescheduled: true });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /reject
export const getRejectedCandidates = async (req, res) => {
  try {
    const candidates = await Application.find({ profileStatus: "Rejected" });
    const result = candidates.map(c => ({
      name: `${c.firstName} ${c.lastName}`,
      appliedDate: c.createdAt,
      profileView: c.profileView
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /interview/schedule
export const postInterviewSchedule = async (req, res) => {
  try {
    const { candidateName, position, recruiterName, interviewDate, interviewTime, meetingMode, durationMinutes, sendNotification } = req.body;
    const schedule = new InterviewSchedule({ candidateName, position, recruiterName, interviewDate, interviewTime, meetingMode, durationMinutes, sendNotification });
    await schedule.save();
    res.status(201).json({ message: "Interview scheduled.", schedule });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// POST /onreschedule
export const postOnReschedule = async (req, res) => {
  try {
    
    const { scheduleId, newDate, newTime } = req.body;
    const schedule = await InterviewSchedule.findById(scheduleId);
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });
    schedule.rescheduled = true;
    schedule.previousSchedule = {
      interviewDate: schedule.interviewDate,
      interviewTime: schedule.interviewTime,
      updatedAt: new Date().toISOString()
    };
    schedule.interviewDate = newDate;
    schedule.interviewTime = newTime;
    await schedule.save();
    res.status(200).json({ message: "Interview rescheduled.", schedule });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// POST /onhold
export const postOnHoldStatus = async (req, res) => {
  try {
    const { candidateId, scheduleId } = req.body;
    
    // Check if we have either candidateId or scheduleId
    if (!candidateId && !scheduleId) {
      return res.status(400).json({ 
        error: "Either candidateId or scheduleId is required",
        message: "Provide candidateId for application or scheduleId for interview schedule"
      });
    }

    // If scheduleId is provided, update interview schedule status
    if (scheduleId) {
      if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
        return res.status(400).json({ error: "Invalid scheduleId format" });
      }

      const schedule = await InterviewSchedule.findById(scheduleId);
      if (!schedule) {
        return res.status(404).json({ 
          error: "Interview schedule not found",
          message: `No interview schedule found with ID: ${scheduleId}`
        });
      }
      
      const previousStatus = schedule.status;
      schedule.status = "OnHold";
      await schedule.save();
      
      return res.status(200).json({ 
        success: true,
        message: "Interview schedule status updated to OnHold.",
        data: {
          scheduleId: schedule._id,
          candidateName: schedule.candidateName,
          position: schedule.position,
          previousStatus: previousStatus,
          newStatus: "OnHold",
          interviewDate: schedule.interviewDate,
          interviewTime: schedule.interviewTime
        }
      });
    }

    // If candidateId is provided, update application status
    if (candidateId) {
      if (!mongoose.Types.ObjectId.isValid(candidateId)) {
        return res.status(400).json({ error: "Invalid candidateId format" });
      }

      const candidate = await Application.findById(candidateId);
      if (!candidate) {
        return res.status(404).json({ 
          error: "Candidate not found",
          message: `No candidate found with ID: ${candidateId}`
        });
      }
      
      const previousStatus = candidate.profileStatus;
      candidate.profileStatus = "OnHold";
      await candidate.save();
      
      return res.status(200).json({ 
        success: true,
        message: "Candidate status updated to OnHold.",
        data: {
          candidateId: candidate._id,
          name: `${candidate.firstName} ${candidate.lastName}`,
          previousStatus: previousStatus,
          newStatus: "OnHold"
        }
      });
    }
    
  } catch (err) {
    console.error("Error updating status to OnHold:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /all - Helper endpoint to list all candidates with their IDs
export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Application.find().select('_id firstName lastName profileStatus createdAt');
    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates.map(c => ({
        id: c._id,
        name: `${c.firstName} ${c.lastName}`,
        status: c.profileStatus,
        appliedDate: c.createdAt
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};