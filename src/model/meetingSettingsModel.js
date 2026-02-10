import mongoose from "mongoose";

const meetingSettingsSchema = new mongoose.Schema(
  {
    defaultInterviewDuration: {
      type: String,
      required: true,
    },
    meetingPlatform: {
      type: String,
      enum: ["Zoom", "Google Meet", "Teams", "Other"],
      required: true,
    },
    maxInterviewPerDay: {
      type: Number,
      required: true,
      default: 1,
    },
    allowRescheduling: {
      type: Boolean,
      default: false,
    },
    calendarIntegration: {
      type: String, 
    },
    defaultCalendarView: {
      type: String,
      enum: ["Day", "Week", "Month"],
      default: "Week",
    },
    autoRecord: {
      type: Boolean,
      default: false,
    },
    requireConsent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const meetingSettings = mongoose.model("MeetingSettings", meetingSettingsSchema);

export default meetingSettings;
