import Application from "../../model/applicantSchema.js";
import Job from "../../model/jobSchema.js";

const createApplications = async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();
    await Job.findByIdAndUpdate(application.jobId, { $inc: { applicantsCount: 1 } });
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export default { createApplications, createJob };