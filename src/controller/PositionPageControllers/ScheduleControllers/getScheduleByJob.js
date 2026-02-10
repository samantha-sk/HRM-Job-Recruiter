import Application from "../../../model/applicantSchema.js";

export const getScheduleByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const scheduledCandidates = await Application.find({ jobId, profileStatus: "Interview" });
    res.status(200).json({ success: true, data: scheduledCandidates });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
