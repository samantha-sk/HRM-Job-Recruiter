import { Types } from "mongoose";
import Task from "../../../model/taskSchema.js";
import Application from "../../../model/applicantSchema.js";

const viewTask = async (req, res) => {
  try {
    const { applicationId } = req.params;
    if (!applicationId || !Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ success: false, message: "Invalid ApplicationID!" });
    }

    const application = await Application.findById(applicationId)
      .populate({ path: "jobId", select: "jobRole" })
      .lean();

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    const tasks = await Task.find({ applicationId })
      .sort({ roundNo: 1 })
      .select([
        "_id","titleAndDescription","roundNo","roundType",
        "taskStatus","evaluationStatus","assignedDate",
        "submittedDate","startTaskTime","endTaskTime",
        "totalTimeTaken","totalQuestions","correctCount",
        "incorrectCount","score","scorePercentage","reviewerNotes"
      ])
      .lean();

    const fullName = [application.firstName, application.middleName, application.lastName]
      .filter(Boolean)
      .join(" ");

    const response = tasks.map(task => ({
      taskId: task._id,
      candidateName: fullName,
      jobRole: application.jobId?.jobRole ?? null,
      titleAndDescription: task.titleAndDescription,
      roundNo: task.roundNo,
      roundType: task.roundType,
      taskStatus: task.taskStatus,
      evaluationStatus: task.evaluationStatus,
      assignedDate: task.assignedDate,
      submittedDate: task.submittedDate,
      startTaskTime: task.startTaskTime,
      endTaskTime: task.endTaskTime,
      totalTimeTaken: task.totalTimeTaken,
      totalQuestions: task.totalQuestions,
      correctCount: task.correctCount,
      incorrectCount: task.incorrectCount,
      score: task.score,
      scorePercentage: task.scorePercentage,
      reviewerNotes: task.reviewerNotes ?? null
    }));

    return res.status(200).json({
      success: true,
      candidate: {
        applicationId: application._id,
        candidateName: fullName,
        email: application.email,
        jobRole: application.jobId?.jobRole ?? null
      },
      data: response
    });
  } catch (err) {
    console.error("Cannot fetch tasks:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch task summary." });
  }
};

export default viewTask;