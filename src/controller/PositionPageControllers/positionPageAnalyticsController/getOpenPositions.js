import Job from "../../../model/jobSchema.js";

const getOpenPositions = async (req, res) => {
  try {
    const openPositionsCount = await Job.countDocuments({ jobStatus: "Open" });
    
    res.status(200).json({
      success: true,
      data: {
        openPositionsCount
      },
      message: "Open positions count retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching open positions count:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export default getOpenPositions;
