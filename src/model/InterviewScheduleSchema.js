import mongoose from "mongoose";

const interviewScheduleSchema = new mongoose.Schema({
  candidateName: { type: String, required: true },
  position: { type: String, required: true },
  recruiterName: { type: String, required: true },
  interviewDate: { type: String, required: true },
  interviewTime: { type: String, required: true },
  meetingMode: { type: String, enum: ['Online', 'Offline'], required: true },
  durationMinutes: { type: Number, default: 30 },
  sendNotification: { type: Boolean, default: false },
  status: { type: String, enum: ['Scheduled', 'Cancelled', 'Completed', 'Rescheduled', 'OnHold'], default: 'Scheduled' },
  
  // Rescheduling Info
  rescheduled: {
    type: Boolean,
    default: false
  },
  previousSchedule: {
    interviewDate: String,
    interviewTime: String,
    updatedAt: String
  }
}, { timestamps: true });

const InterviewSchedule = mongoose.model("InterviewSchedule", interviewScheduleSchema);

export default InterviewSchedule;