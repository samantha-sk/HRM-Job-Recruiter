import Application from "../../../model/applicantSchema.js";
import mongoose from "mongoose";

// GET /shortlisted/:jobId - Get shortlisted candidates for a specific job
export const getShortlistedCandidatesByJob = async (req, res) => {
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
      profileStatus: "Shortlisted" 
    })
    .populate('jobId', 'jobTitle department hiringManager')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ appliedOn: -1 });

    const totalCandidates = await Application.countDocuments({ 
      jobId: jobId,
      profileStatus: "Shortlisted" 
    });

    const result = candidates.map(c => ({
      candidateId: c._id,
      name: `${c.firstName} ${c.lastName}`,
      email: c.email,
      contactNumber: c.contactNumber,
      shortlistedDate: c.shortlistingDetails.shortlistedOn || c.appliedOn,
      shortlistType: c.shortlistingDetails.shortlistType,
      shortlistReason: c.shortlistingDetails.shortlistReason,
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
      message: "Shortlisted candidates retrieved successfully"
    });
  } catch (err) {
    console.error("Error fetching shortlisted candidates:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export default getShortlistedCandidatesByJob;
