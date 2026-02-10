import express from "express";
import positionPageAnalyticsRoutes from "./positionPageAnalyticsRoutes/positionPageAnalyticsRoutes.js";
import jobsRoutes from "./JobsRoutes/jobsRoutes.js";
import jobDescriptionRoutes from "./JobDescriptionRoutes/jobDescriptionRoutes.js";
import candidateStatusRoutes from "./CandidateStatusRoutes/candidateStatusRoutes.js";
import scheduleRoutes from "./ScheduleRoutes/scheduleRoutes.js";

const router = express.Router();

// Position Page Routes
router.use("/analytics", positionPageAnalyticsRoutes);
router.use("/jobs", jobsRoutes);
router.use("/job-description", jobDescriptionRoutes);
router.use("/candidate-status", candidateStatusRoutes);
router.use("/schedule", scheduleRoutes);

export default router;
