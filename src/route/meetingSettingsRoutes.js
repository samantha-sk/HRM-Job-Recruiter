// src/route/meetingSettingsRoutes.js
import express from "express";
import getMeeting from "../controller/settings/meetingSettings/getMeeting.js";
import addMeeting from "../controller/settings/meetingSettings/addMeeting.js";
import updateMeeting from "../controller/settings/meetingSettings/updateMeeting.js";
import deleteMeeting from "../controller/settings/meetingSettings/deleteMeeting.js";


const router = express.Router();
router.post("/", addMeeting);
router.get("/get/:id", getMeeting);
router.put("/update/:id", updateMeeting);
router.delete("/delete/:id", deleteMeeting);

export default router;
