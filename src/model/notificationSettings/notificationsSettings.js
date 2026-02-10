
import mongoose from "mongoose";

const notificationSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  dailyInterviewUpdate: { type: Boolean, default: false },
  newEventCreated: { type: Boolean, default: false },
  whenAddedOnNewTeam: { type: Boolean, default: false },
  mobilePush: { type: Boolean, default: false },
  desktopNotification: { type: Boolean, default: false },
  emailNotification: { type: Boolean, default: false },
  notifyBeforeInterview: { type: Boolean, default: false },
  firstReminder: { type: String, default: "" },
  secondReminder: { type: String, default: "" },

}, { timestamps: true });

export default mongoose.model("NotificationSettings", notificationSettingsSchema);
