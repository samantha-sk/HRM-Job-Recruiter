import Task from "../../model/taskSchema.js";
import Job from "../../model/jobSchema.js";

const createTask = async (req, res) => {
  try {
    const { jobCode, jobRole, titleAndDescription, roundType, createQuestion, attachments } = req.body;
    if (!jobCode || !jobRole || !titleAndDescription || !roundType) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const job = await Job.findOne({ jobCode, jobRole });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found: Invalid jobCode / jobRole" });
    }

    const existingTask = await Task.findOne({ jobId: job._id, roundType });
    if (existingTask) {
      return res.status(409).json({ success: false, message: "Task for this job and roundType already exists." });
    }

    let questionsWithNumber = [];
    if (roundType === "aptitude") {
      if (!createQuestion || !Array.isArray(createQuestion) || createQuestion.length === 0) {
        return res.status(400).json({ success: false, message: "At least one question is required for this round!" });
      }

      for (let i = 0; i < createQuestion.length; i++) {
        const q = createQuestion[i];
        if (!q.question || !q.correctAnswer) {
          return res.status(400).json({ success: false, message: `Question ${i + 1} must have both question and answer!` });
        }
      }

      questionsWithNumber = createQuestion.map((q, index) => ({
        questionNumber: index + 1,
        question: q.question,
        options: q.options || [],
        correctAnswer: q.correctAnswer
      }));
    }

    const task = new Task({
      jobId: job._id,
      titleAndDescription,
      roundType,
      createQuestion: questionsWithNumber,
      attachments: attachments || []
    });

    await task.save();
    return res.status(201).json({ success: true, message: "Task created successfully.", taskId: task._id });
  } 
  catch (err) {
    console.error("Error creating task! : ", err);
    return res.status(500).json({ success: false, message: "Failed to create task." });
  }
};

export default createTask;