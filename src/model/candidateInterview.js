import mongoose from "mongoose";

const candidateStatsSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, unique: true },

    applicationsReceived: { type: Number, default: 0 },
    cvsSelected: { type: Number, default: 0 },
    rejected: { type: Number, default: 0 },
    interviews: { type: Number, default: 0 },
    hired: { type: Number, default: 0 }
  },
  { timestamps: true }
);

candidateStatsSchema.methods.toPercentageJSON = function () {
  const total =
    this.applicationsReceived +
    this.cvsSelected +
    this.rejected +
    this.interviews +
    this.hired || 1;

  return {
    role: this.role,
    applicationsReceived: ((this.applicationsReceived / total) * 100).toFixed(2),
    cvsSelected: ((this.cvsSelected / total) * 100).toFixed(2),
    rejected: ((this.rejected / total) * 100).toFixed(2),
    interviews: ((this.interviews / total) * 100).toFixed(2),
    hired: ((this.hired / total) * 100).toFixed(2)
  };
};

const CandidateInterview = mongoose.model("CandidateStats", candidateStatsSchema);
export default CandidateInterview;
