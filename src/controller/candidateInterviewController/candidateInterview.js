import CandidateInterview from "../../model/candidateInterview.js";
import Application from "../../model/applicantSchema.js";

const calculatePercentages = (counts) => {
  const total =
    counts.applicationsReceived +
    counts.cvsSelected +
    counts.rejected +
    counts.interviews +
    counts.hired || 1;
  return {
    applicationsReceived: ((counts.applicationsReceived / total) * 100).toFixed(2),
    cvsSelected: ((counts.cvsSelected / total) * 100).toFixed(2),
    rejected: ((counts.rejected / total) * 100).toFixed(2),
    interviews: ((counts.interviews / total) * 100).toFixed(2),
    hired: ((counts.hired / total) * 100).toFixed(2),
  };
};

const createOrGetCandidateStats = async (req, res) => {

  try {
    const { role } = req.body;
    const applicationsReceived = await Application.countDocuments({ profileStatus: "Applied", position: role });
    const cvsSelected = await Application.countDocuments({ profileStatus: "Selected", position: role });
    const rejected = await Application.countDocuments({ profileStatus: "Rejected", position: role });
    const interviews = await Application.countDocuments({ profileStatus: "Interview", position: role });
    const hired = await Application.countDocuments({ profileStatus: "Hired", position: role });
    const counts = { applicationsReceived, cvsSelected, rejected, interviews, hired };
    let candidate = await CandidateInterview.findOneAndUpdate(
      { role },
      counts,
      { new: true, upsert: true }
    );
    const percentages = calculatePercentages(candidate);
    return res.status(200).json(percentages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default createOrGetCandidateStats;