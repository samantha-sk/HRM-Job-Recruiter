import express from "express";
import scheduleController from "../controller/scheduleSortBy/scheduleSortByController.js";

const router = express.Router();


// GET schedules with status 'Hired'
router.get("/hired", (req, res) => scheduleController.getSchedulesByStatus(req, res, 'Hired'));

// GET schedules with status 'On Hold'
router.get("/on-hold", (req, res) => scheduleController.getSchedulesByStatus(req, res, 'On Hold'));

// GET schedules with status 'Completed'
router.get("/completed", (req, res) => scheduleController.getSchedulesByStatus(req, res, 'Completed'));

// GET schedules with status 'Reject'
router.get("/reject", (req, res) => scheduleController.getSchedulesByStatus(req, res, 'Reject'));

// GET schedules with status 'Upcoming'
router.get("/upcoming", (req, res) => scheduleController.getSchedulesByStatus(req, res, 'Upcoming'));

// GET schedules with status 'In-completed'
router.get("/incomplete", (req, res) => scheduleController.getSchedulesByStatus(req, res, 'Incomplete'));

// GET schedules by Status + Position
router.get("/position-status", scheduleController.getSchedulesByStatusAndPosition);

// GET schedules by Date Range
router.get("/date-range", scheduleController.getSchedulesByDateRange);

export default router;
