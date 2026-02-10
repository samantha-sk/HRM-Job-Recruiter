import Job from "../../../model/jobSchema.js";

const getClosedPositionsCount = async (req, res) => {
  try {
    const closedPositionsCount = await Job.countDocuments({ jobStatus: "Closed" });
    
    res.status(200).json({
      success: true,
      data: {
        closedPositionsCount
      },
      message: "Closed positions count retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching closed positions count:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export default getClosedPositionsCount;
