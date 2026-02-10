import mongoose from "mongoose";
import Task from "../../model/taskSchema.js";

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid task ID." });
    }
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }
    res.status(200).json({ 
      success: true, 
      message: "Task deleted successfully." 
    });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete the task." });
  }
};

export default deleteTask;