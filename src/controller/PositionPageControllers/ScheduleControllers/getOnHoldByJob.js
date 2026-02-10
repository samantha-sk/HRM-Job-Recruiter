import Application from "../../../model/applicantSchema.js";

export const getOnHoldByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const onHoldCandidates = await Application.find({ jobId, profileStatus: "OnHold" });
    res.status(200).json({ success: true, data: onHoldCandidates });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
