import express from "express";
import createController from "../controller/jobPostController/createJob.js";
import getController from "../controller/jobPostController/getJob.js";
import updateController from "../controller/jobPostController/updateJob.js";
import deleteController from "../controller/jobPostController/deleteJob.js";

const router = express.Router();

router.post("/createJob", createController.createJob);
router.get("/displayJob", getController.getJob);
router.get("/getJob/:id", getController.getJobById);
router.put("/updateJob/:id", updateController.updateJob);
router.delete("/deleteJob/:id", deleteController.deleteJob);

export default router;