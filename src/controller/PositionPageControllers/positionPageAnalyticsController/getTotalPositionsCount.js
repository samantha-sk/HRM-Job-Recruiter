import Job from "../../../model/jobSchema.js";

const getTotalPositionsCount = async (req, res) => {
  try {
    const totalPositions = await Job.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        totalPositions
      },
      message: "Total positions count retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching total positions count:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export default getTotalPositionsCount;
