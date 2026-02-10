import mongoose from "mongoose";

const applicantsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String }
}, { timestamps: true });

export default mongoose.model("Applicants", applicantsSchema);
