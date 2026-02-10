import express from "express";
import postScheduleByJob from "../../../controller/PositionPageControllers/ScheduleControllers/postScheduleByJob.js";
import postRescheduleByJob from "../../../controller/PositionPageControllers/ScheduleControllers/postRescheduleByJob.js";
import postOnHoldStatusByJob from "../../../controller/PositionPageControllers/ScheduleControllers/postOnHoldStatusByJob.js";

const router = express.Router();

// ============ SCHEDULE MANAGEMENT ROUTES ============

// Interview Scheduling Operations
router.post("/:jobId/schedule", postScheduleByJob);
router.post("/:jobId/reschedule", postRescheduleByJob);
router.post("/:jobId/onhold", postOnHoldStatusByJob);

export default router;
