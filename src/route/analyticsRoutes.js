import express from "express";
import { 
    getAppliedCount,
    getSelectedCount,
    getHiredCount,
    getRejectedCount
} from "../controller/DashboardsController/analyticsController.js";

const router = express.Router();

// Routes to get counts of different application statuses
router.get("/countofapplied", getAppliedCount);
router.get("/countofselected", getSelectedCount);
router.get("/countofhired", getHiredCount);
router.get("/countofrejected", getRejectedCount);

export default router;
