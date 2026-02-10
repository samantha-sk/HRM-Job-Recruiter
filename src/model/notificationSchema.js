import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["reminders", "applicants", "favourites"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      default: Date.now,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },

    // 🔑 Add applicantId reference
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
       required: false, // must match model name in applicantSchema.js
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
