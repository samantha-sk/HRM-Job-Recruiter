import Job from "../../../model/jobSchema.js";

const getAllClosedPositionJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const closedJobs = await Job.find({ jobStatus: "Closed" })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalClosedJobs = await Job.countDocuments({ jobStatus: "Closed" });
    const totalPages = Math.ceil(totalClosedJobs / parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: {
        jobs: closedJobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalJobs: totalClosedJobs,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      },
      message: "Closed position jobs retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching closed position jobs:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export default getAllClosedPositionJobs;
