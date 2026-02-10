import express from "express";
import createOrGetCandidateStats from "../controller/candidateInterviewController/candidateInterview.js";

const router = express.Router();

router.post("/dashboard",createOrGetCandidateStats);

export default router;