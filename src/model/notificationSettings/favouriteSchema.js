import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema({
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "Applicant" },
  isFavourite: { type: Boolean, default: false },
  addedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Favourite", favouriteSchema);
