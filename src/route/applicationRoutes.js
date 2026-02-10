import express from "express";
import createController from "../controller/jobPostController/createJob.js";
import getController from "../controller/jobPostController/getJob.js";
import updateController from "../controller/jobPostController/updateJob.js";
import deleteController from "../controller/jobPostController/deleteJob.js";

const router = express.Router();

router.post("/createApp", createController.createApplications);
router.get("/displayApp", getController.getApplications);
router.get("/getApp/:id", getController.getApplicationById);
router.put("/updateApp/:id", updateController.updateApplication);
router.delete("/deleteApp/:id", deleteController.deleteApplication);

export default router;