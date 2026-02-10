import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import connectDb from "./src/config/dbConfig.js"; 
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import applicationRoutes from "./src/route/applicationRoutes.js";
import jobRoutes from "./src/route/jobRoutes.js";
import userRoutes from "./src/route/userRoutes.js"; 
import profileRoutes from "./src/route/profileRoutes.js";
import meetingSettingsRoutes from "./src/route/meetingSettingsRoutes.js";
import privacySecurityRoutes from "./src/route/privacySecurityRoutes.js";
import candidateInterviewRoutes from "./src/route/candidateInterviewRoute.js";
import analyticsRoutes from "./src/route/analyticsRoutes.js";
import candidateDetailsRoutes from "./src/route/CandidateDetailsRoute.js";
import employeeRoutes from "./src/route/employee.js";
import dashboardInfoRoutes from "./src/route/dashboardInfoRoutes.js";
import getSchedulePageTask from "./src/route/todaySchedule.js"
import notifyRoutes from "./src/route/notifyRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();

app.use(helmet());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
  })
);
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173","http://localhost:3000"],
    credentials: true,
  })
);

app.set("trust proxy", 1);

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, 
  message: "Too many requests from this IP, please try again after an hour",
});

app.use("/api/users/v1/login", limiter);
app.use("/api/users/v1", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/meetings", meetingSettingsRoutes);
app.use("/api/privacy-security", privacySecurityRoutes);
app.use("/api/candidateinterview", candidateInterviewRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/candidates", candidateDetailsRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/dashboard", dashboardInfoRoutes);
app.use("/api/todayschedule", getSchedulePageTask);
app.use("/api/notifications", notifyRoutes);

async function startServer() {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
}

<<<<<<< HEAD

startServer();
=======
startServer();
>>>>>>> b26d2b1 (notification schema updated)
