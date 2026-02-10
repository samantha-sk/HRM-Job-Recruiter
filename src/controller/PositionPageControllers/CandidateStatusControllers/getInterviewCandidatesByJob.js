import Application from "../../../model/applicantSchema.js";
import InterviewSchedule from "../../../model/InterviewScheduleSchema.js";
import mongoose from "mongoose";

// GET /interview/:jobId - Get interview candidates for a specific job
export const getInterviewCandidatesByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid jobId format" 
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const candidates = await Application.find({ 
      jobId: jobId,
      profileStatus: "Interview" 
    })
    .populate('jobId', 'jobTitle department hiringManager')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ appliedOn: -1 });

    const totalCandidates = await Application.countDocuments({ 
      jobId: jobId,
      profileStatus: "Interview" 
    });

    // Find interview schedule for each candidate
    const result = await Promise.all(candidates.map(async c => {
      const schedule = await InterviewSchedule.findOne({ 
        candidateName: `${c.firstName} ${c.lastName}`,
        position: c.jobId.jobTitle
      });
      
      return {
        candidateId: c._id,
        name: `${c.firstName} ${c.lastName}`,
        email: c.email,
        contactNumber: c.contactNumber,
        profileView: c.profileView,
        profileStatus: c.profileStatus,
        experienceLevel: c.experienceLevel,
        skills: c.skills,
        candidateRating: c.candidateRating,
        candidateFeedback: c.candidateFeedback,
        jobDetails: c.jobId,
        interviewSchedule: schedule ? {
          scheduleId: schedule._id,
          interviewDate: schedule.interviewDate,
          interviewTime: schedule.interviewTime,
          recruiterName: schedule.recruiterName,
          meetingMode: schedule.meetingMode,
          duration: schedule.durationMinutes,
          status: schedule.status
        } : null
      };
    }));

    res.status(200).json({
      success: true,
      data: {
        candidates: result,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCandidates / parseInt(limit)),
          totalCandidates,
          hasNextPage: parseInt(page) < Math.ceil(totalCandidates / parseInt(limit)),
          hasPrevPage: parseInt(page) > 1
        }
      },
      message: "Interview candidates retrieved successfully"
    });
  } catch (err) {
    console.error("Error fetching interview candidates:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export default getInterviewCandidatesByJob;
