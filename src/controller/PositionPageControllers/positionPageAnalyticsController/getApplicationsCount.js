import Application from "../../../model/applicantSchema.js";

const getApplicationsCount = async (req, res) => {
  try {
    const totalApplicationsCount = await Application.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        totalApplicationsCount
      },
      message: "Total applications count retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching applications count:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export default getApplicationsCount;
