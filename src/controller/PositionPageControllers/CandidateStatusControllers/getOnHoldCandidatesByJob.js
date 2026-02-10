import Application from "../../../model/applicantSchema.js";
import mongoose from "mongoose";

// GET /onhold/:jobId - Get onHold candidates for a specific job
export const getOnHoldCandidatesByJob = async (req, res) => {
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
      profileStatus: "OnHold" 
    })
    .populate('jobId', 'jobTitle department hiringManager')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ appliedOn: -1 });

    const totalCandidates = await Application.countDocuments({ 
      jobId: jobId,
      profileStatus: "OnHold" 
    });

    const result = candidates.map(c => ({
      candidateId: c._id,
      name: `${c.firstName} ${c.lastName}`,
      email: c.email,
      contactNumber: c.contactNumber,
      onHoldDate: c.appliedOn,
      profileView: c.profileView,
      profileStatus: c.profileStatus,
      experienceLevel: c.experienceLevel,
      skills: c.skills,
      candidateRating: c.candidateRating,
      candidateFeedback: c.candidateFeedback,
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
      message: "OnHold candidates retrieved successfully"
    });
  } catch (err) {
    console.error("Error fetching onHold candidates:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export default getOnHoldCandidatesByJob;
