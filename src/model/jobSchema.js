import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({

    jobTitle: String,
    jobRole: String,
    department: String,
    jobLocation: String,

    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Remote"],
    },

    jobCode: String,
    hiringManager: String,
    numberOfOpenings: { type: Number, min: 1 },

    jobStatus: {
      type: String,
      enum: ["Open", "Closed", "On Hold"],
      default: "Open",
    },

    closingDate: Date, //flags -> compare curr date with closing date
    postedOn: { type: Date, default: Date.now },
    applicantsCount: { type: Number, default: 0 }, //increment applicant count -> display in positions page

    about: String,
    responsibilities: String,
    requirements: String,
    preferredQualifications: String,
    lookingFor: String,

    applicationLink: String,
    companyInfo: String,
    companyName: String,
    experienceRange: String,

    posterVisuals: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
});

const Job = mongoose.model("Job", jobSchema);
export default Job;