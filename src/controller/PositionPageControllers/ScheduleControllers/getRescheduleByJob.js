import Application from "../../../model/applicantSchema.js";

export const getRescheduleByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const rescheduledCandidates = await Application.find({ jobId, profileStatus: "Rescheduled" });
    res.status(200).json({ success: true, data: rescheduledCandidates });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
