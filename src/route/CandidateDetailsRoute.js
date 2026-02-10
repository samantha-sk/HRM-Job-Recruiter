import express from "express";
import {
  getAppliedCandidates,
  getSelectedCandidates,
  getInterviewCandidates,
  getScheduleCandidates,
  getOnHoldCandidates,
  getOnRescheduleCandidates,
  getRejectedCandidates,
  postInterviewSchedule,
  postOnHoldStatus,
  postOnReschedule,
  getAllCandidates
} from "../controller/scheduleController/scheduleController.js";

const router = express.Router();
router.get("/all", getAllCandidates); // Helper endpoint to list all candidates
router.get("/applied", getAppliedCandidates);
router.get("/selected", getSelectedCandidates);
router.get("/interview", getInterviewCandidates);
router.get("/schedule", getScheduleCandidates);
router.get("/onhold", getOnHoldCandidates);
router.get("/onreschedule", getOnRescheduleCandidates);
router.get("/reject", getRejectedCandidates);
router.post("/interview/schedule", postInterviewSchedule);
router.post("/onhold", postOnHoldStatus);
router.post("/onreschedule", postOnReschedule);

export default router;
