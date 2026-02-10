import candidateDetails from "../../model/scheduleModel.js";

const postSchedule = async (req, res) => {
  try {
    const {
      Date,
      Time,
      Position,
      Candidate,
      Recruiter,
      Mode,
      Status,
      Reschedule
    } = req.body;
    if (
      !Date || !Time || !Position || !Candidate ||
      !Recruiter || !Mode || !Status || Reschedule === undefined
    ) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }
    const existingSchedule = await candidateDetails.findOne({
      Date,
      Time,
      Candidate,
      Position
    });

    if (existingSchedule) {
      return res.status(409).json({ message: ' Schedule already exists for this candidate at the given time and position.' });
    }
    const newSchedule = new candidateDetails(req.body);
    await newSchedule.save();
    res.status(201).json({ message: 'Schedule added successfully', data: newSchedule });
  } catch (error) {
    console.error("Error saving schedule:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export default postSchedule;