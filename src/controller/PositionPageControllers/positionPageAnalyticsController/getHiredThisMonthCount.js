import Application from "../../../model/applicantSchema.js";

const getHiredThisMonthCount = async (req, res) => {
  try {
    // Get the current date and calculate the start of the month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    
    const hiredThisMonthCount = await Application.countDocuments({
      profileStatus: "Hired",
      appliedOn: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });
    
    res.status(200).json({
      success: true,
      data: {
        hiredThisMonthCount,
        month: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      },
      message: "Hired this month count retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching hired this month count:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export default getHiredThisMonthCount;
