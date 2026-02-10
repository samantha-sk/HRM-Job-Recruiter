import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  responsibility: String,
  currentCTC: { type: Number, min: 0 },
  expectedCTC: { type: Number, min: 0 },
  noticePeriod: String,
});

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degreeLevel: {
    type: String,
    enum: [
      "Diploma",
      "Bachelor's level Degree",
      "Master's level Degree",
      "Other",
    ],
    required: true,
  },
  program: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  pursuing: { type: Boolean, default: false },
  yearOfGraduation: { type: Number },
  gpa: { type: Number, min: 0, max: 10 },
});

const applicationSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  country: String,
  postalCode: String,
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
  },
  contactNumber: {
    type: String,
    match: /^[0-9]{10,15}$/,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  experienceLevel: {
    type: String,
    enum: [
      "Fresher",
      "Entry Level",
      "Mid Level",
      "Senior Level",
      "Executive Level",
    ],
  },

  education: [educationSchema],
  experience: [experienceSchema],
  skills: [String],

  attachments: [
    {
      fileName: String,
      fileUrl: String,
      fileType: String,
    },
  ],

  referralSource: String,
  consent: {
    type: Boolean,
    default: false,
  },

  profileStatus: {
    type: String,
    enum: ["Applied", "Selected", "Rejected", "OnHold", "Interview", "Hired", "Rescheduled"],
    default: "Applied",
    required: true
  },

  // View stats -> true (viewed), false (not viewed)
  profileView: {
    type: Boolean,
    default: false,
    required: true
  },

  // Candidate Feedback
  candidateFeedback: {
    communication: {
      type: String,
      enum: ["Excellent", "Good", "Below Average", "Inadequate"],
      default: null
    },
    technical: {
      type: String,
      enum: ["Excellent", "Good", "Below Average", "Inadequate"],
      default: null
    },
    programming: {
      type: String,
      enum: ["Excellent", "Good", "Below Average", "Inadequate"],
      default: null
    },
    problemSolving: {
      type: String,
      enum: ["Excellent", "Good", "Below Average", "Inadequate"],
      default: null
    },
    feedbackDescription: {
      type: String,
      default: "",
      trim: true
    }
  },

  termsAccepted: {
    type: Boolean,
    required: true,
  },

  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;