import Job from "../../../model/jobSchema.js";

const getAllOpeningPositionJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const openJobs = await Job.find({ jobStatus: "Open" })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalOpenJobs = await Job.countDocuments({ jobStatus: "Open" });
    const totalPages = Math.ceil(totalOpenJobs / parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: {
        jobs: openJobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalJobs: totalOpenJobs,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      },
      message: "Open position jobs retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching open position jobs:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export default getAllOpeningPositionJobs;
