import { Types } from "mongoose";
import Application from "../../../model/applicantSchema.js";

const evaluateTask = async (req, res) => {
  try {
    const { applicationId, taskId } = req.params;
    const { score, reviewerNotes = "" } = req.body;

    if (!applicationId || !taskId || !Types.ObjectId.isValid(applicationId) || !Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ success: false, message: "Invalid Application or Task ID." });
    }

    const application = await Application.findById(applicationId).populate({
      path: "jobId",
      select: "jobRole"
    });
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    const taskEntry = application.tasks.find(t => t.taskId.toString() === taskId);
    if (!taskEntry) {
      return res.status(404).json({ success: false, message: "Task not assigned or submitted!" });
    }

    taskEntry.score = score;
    taskEntry.reviewerNotes = reviewerNotes;

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Task evaluated successfully.",
      task: taskEntry
    });
  } catch (err) {
    console.error("Error evaluating task:", err);
    return res.status(500).json({ success: false, message: "Failed to evaluate task." });
  }
};

export default evaluateTask;