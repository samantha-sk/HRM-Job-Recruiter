import { Types } from "mongoose";
import Task from "../../../model/taskSchema.js";
import Application from "../../../model/applicantSchema.js";

const submitTask = async (req, res) => {
  try {
    const { applicationId, taskId } = req.params;
    const { answers = [], startTaskTime, endTaskTime } = req.body;

    if (!applicationId || !taskId || !Types.ObjectId.isValid(applicationId) || !Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ success: false, message: "Invalid Application or Task ID." });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    const taskEntry = application.tasks.find(t => t.taskId.toString() === taskId);
    if (!taskEntry) {
      return res.status(404).json({ success: false, message: "Task not assigned to applicant." });
    }

    const jobTask = await Task.findById(taskId);
    if (!jobTask) {
      return res.status(404).json({ success: false, message: "Job-level task not found." });
    }

    let correctCount = 0;
    if (jobTask.roundType === "aptitude" && jobTask.createQuestion?.length) {
      answers.forEach(ans => {
        const q = jobTask.createQuestion.find(q => q.questionNumber === ans.questionNumber);
        if (q?.correctAnswer === ans.answer) correctCount++;
      });
    }

    const startTime = startTaskTime ? new Date(startTaskTime) : new Date();
    const endTime = endTaskTime ? new Date(endTaskTime) : new Date();

    taskEntry.answers = answers;
    taskEntry.startDateTime = startTime;
    taskEntry.endDateTime = endTime;
    taskEntry.totalTime = (endTime - startTime) / 1000; // seconds
    taskEntry.correctCount = correctCount;
    taskEntry.incorrectCount = taskEntry.questionCount - correctCount;
    taskEntry.score = taskEntry.questionCount > 0 ? Math.round((correctCount / taskEntry.questionCount) * 100 * 100) / 100 : 0;
    taskEntry.submittedDate = new Date();

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Task submitted successfully.",
      task: taskEntry
    });
  } catch (err) {
    console.error("Error submitting task:", err);
    return res.status(500).json({ success: false, message: "Failed to submit task." });
  }
};

export default submitTask;