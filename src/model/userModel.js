import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    businessEmail: { type: String, required: true },
    organizationName: { type: String, required: true },
    role: { type: String, required: true },
    noOfEmployees: { type: String, required: true },
    department: { type: String, required: true },
    contactNumber: { type: String, required: true },
    password: { type: String, required: true },
    companyCode: { type: String },
    isVerified: { type: Boolean, default: false },

    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorCode: { type: String },
    twoFactorExpiry: { type: Date },
    isDeactivated: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export default mongoose.model("user", userSchema);
