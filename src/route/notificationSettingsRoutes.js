import express from "express";
import createNotification  from "../controller/settings/notificationSettings/createNotification.js";
import  getNotification from "../controller/settings/notificationSettings/getNotification.js";
import  updateNotification  from "../controller/settings/notificationSettings/updateNotification.js";
import  deleteNotification  from "../controller/settings/notificationSettings/deleteNotification.js";

const router = express.Router();

router.post("/create", createNotification);
router.get("/:userId", getNotification);
router.put("/:userId", updateNotification);
router.delete("/:userId", deleteNotification);

export default router;
