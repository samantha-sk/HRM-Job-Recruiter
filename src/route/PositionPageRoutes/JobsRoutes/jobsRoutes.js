import express from "express";
import getAllJobs from "../../../controller/PositionPageControllers/JobsControllers/getAllJobs.js";
import getAllOpeningPositionJobs from "../../../controller/PositionPageControllers/JobsControllers/getAllOpeningPositionJobs.js";
import getAllClosedPositionJobs from "../../../controller/PositionPageControllers/JobsControllers/getAllClosedPositionJobs.js";

const router = express.Router();

// Jobs Routes
router.get("/all", getAllJobs);
router.get("/open", getAllOpeningPositionJobs);
router.get("/closed", getAllClosedPositionJobs);

export default router;
