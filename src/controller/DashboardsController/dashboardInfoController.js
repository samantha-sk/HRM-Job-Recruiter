import Application from "../../model/applicantSchema.js";
import InterviewSchedule from "../../model/InterviewScheduleSchema.js";
import Employee from "../../model/employeeSchema.js";

// Get upcoming interviews (applicants with status "Interview" or "Rescheduled")
export const getUpcomingInterviews = async (req, res) => {
    try {
        const upcomingCandidates = await Application.find({ 
            profileStatus: { $in: ["Interview", "Rescheduled"] } 
        }).populate("jobId");
        
        res.status(200).json({
            success: true,
            count: upcomingCandidates.length,
            data: upcomingCandidates.map(candidate => ({
                id: candidate._id,
                name: `${candidate.firstName} ${candidate.lastName}`,
                email: candidate.email,
                contactNumber: candidate.contactNumber,
                status: candidate.profileStatus,
                jobTitle: candidate.jobId?.jobTitle || "N/A",
                appliedDate: candidate.createdAt
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching upcoming interviews",
            error: error.message
        });
    }
};

// Get completed interviews (applicants with status "Hired", "Rejected", "OnHold")
export const getCompletedInterviews = async (req, res) => {
    try {
        const completedCandidates = await Application.find({ 
            profileStatus: { $in: ["Hired", "Rejected", "OnHold"] } 
        }).populate("jobId");
        
        res.status(200).json({
            success: true,
            count: completedCandidates.length,
            data: completedCandidates.map(candidate => ({
                id: candidate._id,
                name: `${candidate.firstName} ${candidate.lastName}`,
                email: candidate.email,
                status: candidate.profileStatus,
                jobTitle: candidate.jobId?.jobTitle || "N/A",
                appliedDate: candidate.createdAt
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching completed interviews",
            error: error.message
        });
    }
};

// Get today's interview schedule (applicants with status "Interview" or "Rescheduled" scheduled for today)
export const getTodayInterviewSchedule = async (req, res) => {
    try {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        // Get interview schedules for today
        const todaySchedules = await InterviewSchedule.find({ 
            interviewDate: todayStr 
        });
        
        res.status(200).json({
            success: true,
            count: todaySchedules.length,
            data: todaySchedules.map(schedule => ({
                id: schedule._id,
                candidateName: schedule.candidateName,
                position: schedule.position,
                recruiterName: schedule.recruiterName,
                interviewTime: schedule.interviewTime,
                meetingMode: schedule.meetingMode,
                status: schedule.status,
                durationMinutes: schedule.durationMinutes
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching today's interview schedule",
            error: error.message
        });
    }
};

// Get total candidates in current month
export const getTotalCandidatesCurrentMonth = async (req, res) => {
    try {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
        
        const monthlyCount = await Application.countDocuments({
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });
        
        res.status(200).json({
            success: true,
            count: monthlyCount,
            period: `${startOfMonth.toDateString()} - ${endOfMonth.toDateString()}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching current month candidates",
            error: error.message
        });
    }
};

// Get total candidates in current week
export const getTotalCandidatesCurrentWeek = async (req, res) => {
    try {
        const currentDate = new Date();
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Sunday
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
        endOfWeek.setHours(23, 59, 59, 999);
        
        const weeklyCount = await Application.countDocuments({
            createdAt: { $gte: startOfWeek, $lte: endOfWeek }
        });
        
        res.status(200).json({
            success: true,
            count: weeklyCount,
            period: `${startOfWeek.toDateString()} - ${endOfWeek.toDateString()}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching current week candidates",
            error: error.message
        });
    }
};

// Get in-process candidates (OnHold, Rescheduled, Applied, Interview)
export const getInProcessCandidates = async (req, res) => {
    try {
        const inProcessCount = await Application.countDocuments({
            profileStatus: { $in: ["OnHold", "Rescheduled", "Applied", "Interview"] }
        });
        
        res.status(200).json({
            success: true,
            count: inProcessCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching in-process candidates",
            error: error.message
        });
    }
};

<<<<<<< HEAD
// Get shortlisted candidates (Shortlisted)
export const getShortlistedCandidates = async (req, res) => {
    try {
        const shortlistedCount = await Application.countDocuments({
            profileStatus: "Shortlisted"
=======
// Get shortlisted candidates (Selected)
export const getShortlistedCandidates = async (req, res) => {
    try {
        const shortlistedCount = await Application.countDocuments({
            profileStatus: "Selected"
>>>>>>> 7fcaf4c (adding dashboard controllers and routes and also adding candidates feedback field in applicant schema)
        });
        
        res.status(200).json({
            success: true,
            count: shortlistedCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching shortlisted candidates",
            error: error.message
        });
    }
};

// Get rejected candidates
export const getRejectedCandidates = async (req, res) => {
    try {
        const rejectedCount = await Application.countDocuments({
            profileStatus: "Rejected"
        });
        
        res.status(200).json({
            success: true,
            count: rejectedCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching rejected candidates",
            error: error.message
        });
    }
};

// Get hired candidates
export const getHiredCandidates = async (req, res) => {
    try {
        const hiredCount = await Application.countDocuments({
            profileStatus: "Hired"
        });
        
        res.status(200).json({
            success: true,
            count: hiredCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching hired candidates",
            error: error.message
        });
    }
};

// Get current week hired candidates
export const getCurrentWeekHired = async (req, res) => {
    try {
        const currentDate = new Date();
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Sunday
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
        endOfWeek.setHours(23, 59, 59, 999);
        
        const weeklyHiredCount = await Application.countDocuments({
            profileStatus: "Hired",
            updatedAt: { $gte: startOfWeek, $lte: endOfWeek }
        });
        
        res.status(200).json({
            success: true,
            count: weeklyHiredCount,
            period: `${startOfWeek.toDateString()} - ${endOfWeek.toDateString()}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching current week hired candidates",
            error: error.message
        });
    }
};

// Get total hired managers (count of employees)
export const getTotalHiredManagers = async (req, res) => {
    try {
        const totalEmployees = await Employee.countDocuments();
        
        res.status(200).json({
            success: true,
            count: totalEmployees,
            message: "Total number of employees/managers"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching total employees count",
            error: error.message
        });
    }
};
<<<<<<< HEAD
export const getMonthlyHired = async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 28);

    const result = await Application.aggregate([
      {
        $match: {
          profileStatus: { $regex: /^hired$/i }, // case-insensitive
          updatedAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: "jobs",              // name of your Job collection
          localField: "jobId",
          foreignField: "_id",
          as: "job"
        }
      },
      { $unwind: "$job" },
      {
        $group: {
          _id: {
            week: { $isoWeek: "$updatedAt" },
            role: "$job.jobTitle"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.week",
          roles: { $push: { role: "$_id.role", count: "$count" } }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Generate 4 weeks data (even if empty)
    const weeks = Array.from({ length: 4 }, (_, i) => {
      const weekData = {
        week: `Week ${i + 1}`,
        "UI Designing": 0,
        "Analyst": 0,
        "Developer": 0,
        "Software Developer": 0
      };
      const data = result[i];
      if (data) {
        data.roles.forEach(r => {
          if (weekData[r.role] !== undefined) {
            weekData[r.role] = r.count;
          }
        });
      }
      return weekData;
    });

    res.json({
      success: true,
      period: `${startDate.toDateString()} - ${new Date().toDateString()}`,
      weeks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

=======
>>>>>>> 7fcaf4c (adding dashboard controllers and routes and also adding candidates feedback field in applicant schema)
