import Application from "../../model/applicantSchema.js";
import Job from "../../model/jobSchema.js";

const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate("jobId").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate("jobId");
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getJob = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default { getApplications, getApplicationById, getJob, getJobById };