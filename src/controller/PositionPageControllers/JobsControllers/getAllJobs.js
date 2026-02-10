import Job from "../../../model/jobSchema.js";

const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const jobs = await Job.find()
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalJobs = await Job.countDocuments();
    const totalPages = Math.ceil(totalJobs / parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: {
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalJobs,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      },
      message: "All jobs retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching all jobs:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export default getAllJobs;
