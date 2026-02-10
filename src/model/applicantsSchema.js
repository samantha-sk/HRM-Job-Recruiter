// src/model/applicantSchema.js
import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    skills: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Applicant", applicantSchema);
