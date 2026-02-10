import candidateDetails from "../../model/scheduleModel.js";

const getScheduleByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const allowedStatuses = ['Completed', 'upcoming', 'Incomplete'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Use one of: ${allowedStatuses.join(', ')}`,
      });
    }
    const filteredData = await candidateDetails.find({ Status: status });
    res.status(200).json({
      message: `Schedule data with status '${status}' fetched successfully.`,
      data: filteredData
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching data by status.",
      error
    });
  }
};

export default getScheduleByStatus;