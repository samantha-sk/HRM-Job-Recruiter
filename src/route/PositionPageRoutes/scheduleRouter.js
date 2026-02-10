import express from "express";
import { getScheduleByJob } from "../../controller/PositionPageControllers/ScheduleControllers/getScheduleByJob.js";
import { getRescheduleByJob } from "../../controller/PositionPageControllers/ScheduleControllers/getRescheduleByJob.js";
import { getOnHoldByJob } from "../../controller/PositionPageControllers/ScheduleControllers/getOnHoldByJob.js";

const router = express.Router();

router.get("/:jobId/schedule", getScheduleByJob);
router.get("/:jobId/reschedule", getRescheduleByJob);
router.get("/:jobId/onhold", getOnHoldByJob);

export default router;
