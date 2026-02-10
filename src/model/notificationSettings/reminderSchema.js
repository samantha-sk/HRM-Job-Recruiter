import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Applicants", 
      required: true
    },
    message: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    isSeen: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Reminder", reminderSchema);
