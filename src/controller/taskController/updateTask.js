import mongoose from "mongoose";
import Task from "../../model/taskSchema.js";

const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ success: false, message: "Invalid task ID." });
    }

    const task = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true, runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }
    
    res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      data: task, 
    });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update the task." });
  }
};

export default updateTask;