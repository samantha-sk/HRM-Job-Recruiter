import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String }],
  answer: { type: String }, 
});

const taskSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Aptitude", "Design", "Coding", "Case Study"],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    questions: [questionSchema],
    additionalInstructions: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
