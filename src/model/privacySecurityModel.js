import mongoose from "mongoose";

const privacySecuritySchema = new mongoose.Schema(
  {
    currentPassword: { type: String, required: true },
    newPassword: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    twoStepAuth: { type: Boolean, default: false },
    accountStatus: {
      type: String,
      enum: ["active", "disabled", "deleted"],
      default: "active",
    },
    sessions: [
      {
        device: { type: String },
        location: { type: String },
        lastActive: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("PrivacySecurity", privacySecuritySchema);
