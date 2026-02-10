import express from "express";

// Candidate Status Controller Imports
import getAppliedCandidatesByJob from "../../../controller/PositionPageControllers/CandidateStatusControllers/getAppliedCandidatesByJob.js";
import getShortlistedCandidatesByJob from "../../../controller/PositionPageControllers/CandidateStatusControllers/getShortlistedCandidatesByJob.js";
import getInterviewCandidatesByJob from "../../../controller/PositionPageControllers/CandidateStatusControllers/getInterviewCandidatesByJob.js";
import getOnHoldCandidatesByJob from "../../../controller/PositionPageControllers/CandidateStatusControllers/getOnHoldCandidatesByJob.js";
import getRescheduledCandidatesByJob from "../../../controller/PositionPageControllers/CandidateStatusControllers/getRescheduledCandidatesByJob.js";
import getRejectedCandidatesByJob from "../../../controller/PositionPageControllers/CandidateStatusControllers/getRejectedCandidatesByJob.js";
import getHiredCandidatesByJob from "../../../controller/PositionPageControllers/CandidateStatusControllers/getHiredCandidatesByJob.js";
import postFeedbackByJob from "../../../controller/PositionPageControllers/CandidateStatusControllers/postFeedbackByJob.js";
import postShortListed from "../../../controller/PositionPageControllers/CandidateStatusControllers/postShortListed.js";
import postReject from "../../../controller/PositionPageControllers/CandidateStatusControllers/postReject.js";
import postHired from "../../../controller/PositionPageControllers/CandidateStatusControllers/postHired.js";

const router = express.Router();

// ============ GET ROUTES - Candidate Status Search by Job ============

// Get candidates by status for specific job
router.get("/:jobId/applied", getAppliedCandidatesByJob);
router.get("/:jobId/shortlisted", getShortlistedCandidatesByJob);
router.get("/:jobId/interview", getInterviewCandidatesByJob);
router.get("/:jobId/onhold", getOnHoldCandidatesByJob);
router.get("/:jobId/rescheduled", getRescheduledCandidatesByJob);
router.get("/:jobId/rejected", getRejectedCandidatesByJob);
router.get("/:jobId/hired", getHiredCandidatesByJob);

// ============ POST ROUTES - Candidate Evaluation ============

// Candidate feedback operation
router.post("/:jobId/feedback", postFeedbackByJob);

// Candidate status change operations
router.post("/:jobId/shortlist", postShortListed);
router.post("/:jobId/reject", postReject);
router.post("/:jobId/hired", postHired);

export default router;
