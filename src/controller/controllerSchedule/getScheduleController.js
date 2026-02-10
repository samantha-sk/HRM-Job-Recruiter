import candidateDetails from "../../model/scheduleModel.js";


const getSchedule = async (req, res) => {
  try {

    function getStartOfDay(date) {
      return new Date(date.setHours(0, 0, 0, 0));
    }

    function getEndOfDay(date) {
      return new Date(date.setHours(23, 59, 59, 999));
    }

    const { type } = req.query;

    let start, end;
    const now = new Date();

    switch (type) {
      case 'yesterday':
        start = getStartOfDay(new Date(now.getTime() - 24 * 60 * 60 * 1000));
        end = getEndOfDay(new Date(now.getTime() - 24 * 60 * 60 * 1000));
        break;
      case 'today':
        start = getStartOfDay(new Date());
        end = getEndOfDay(new Date());
        break;
      case 'tomorrow':
        start = getStartOfDay(new Date(now.getTime() + 24 * 60 * 60 * 1000));
        end = getEndOfDay(new Date(now.getTime() + 24 * 60 * 60 * 1000));
        break;
      default:
        return res.status(400).json({ message: 'Invalid type. Use today, yesterday, or tomorrow.' });
    }

    const filteredData = await candidateDetails.find({
      Date: { $gte: start, $lt: end },
    });

    res.status(200).json({
      message: "Schedule data fetched successfully.",
      data: filteredData
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
};

export default getSchedule;