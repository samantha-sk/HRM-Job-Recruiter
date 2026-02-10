import { Types } from "mongoose";
import Task from "../../../model/taskSchema.js";
import Application from "../../../model/applicantSchema.js";

const assignTask = async (req, res) => {
  try {
    const { email, jobId, roundType } = req.body;

    if (!email || !jobId || !roundType) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    if (!Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, message: "Invalid Job ID." });
    }

    const application = await Application.findOne({ email, jobId });
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    const alreadyAssigned = application.tasks.some(t => t.taskId && t.roundType === roundType);
    if (alreadyAssigned) {
      return res.status(400).json({ success: false, message: "Task not found!" });
    }

    const jobTask = await Task.findOne({ jobId, roundType });
    if (!jobTask) {
      return res.status(404).json({ success: false, message: "No task found for this round." });
    }

    application.tasks.push({
      taskId: jobTask._id,
      roundType,
      assignedDate: new Date(),
      questionCount: jobTask.totalQuestions || 0
    });

    await application.save();

    return res.status(201).json({
      success: true,
      message: "Task assigned to applicant successfully.",
      taskId: jobTask._id
    });
  } catch (err) {
    console.error("Error assigning task:", err);
    return res.status(500).json({ success: false, message: "Failed to assign task." });
  }
};

export default assignTask;