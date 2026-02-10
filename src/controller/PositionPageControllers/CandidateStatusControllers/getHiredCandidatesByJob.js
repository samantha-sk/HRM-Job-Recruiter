import Application from "../../../model/applicantSchema.js";
import mongoose from "mongoose";

// GET /hired/:jobId - Get hired candidates for a specific job
export const getHiredCandidatesByJob = async (req, res) => {
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
      profileStatus: "Hired" 
    })
    .populate('jobId', 'jobTitle department hiringManager')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ 'hiringDetails.hiredOn': -1 });

    const totalCandidates = await Application.countDocuments({ 
      jobId: jobId,
      profileStatus: "Hired" 
    });

    const result = candidates.map(c => ({
      candidateId: c._id,
      name: `${c.firstName} ${c.lastName}`,
      email: c.email,
      contactNumber: c.contactNumber,
      hiredDate: c.hiringDetails.hiredOn,
      salary: c.hiringDetails.salary,
      startDate: c.hiringDetails.startDate,
      hiringNotes: c.hiringDetails.hiringNotes,
      offerLetterSent: c.hiringDetails.offerLetterSent,
      profileView: c.profileView,
      profileStatus: c.profileStatus,
      experienceLevel: c.experienceLevel,
      skills: c.skills,
      candidateRating: c.candidateRating,
      jobDetails: c.jobId
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
      message: "Hired candidates retrieved successfully"
    });
  } catch (err) {
    console.error("Error fetching hired candidates:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export default getHiredCandidatesByJob;