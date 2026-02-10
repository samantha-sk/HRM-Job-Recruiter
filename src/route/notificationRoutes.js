import express from "express";

// Controllers import
import { getNotificationSettings } from "../controller/NotificationsSettingsController.js";
import { addFavourite, getFavourites } from "../controller/favouriteController.js";
import { addReminder, getReminders, markReminderSeen } from "../controller/reminderCOntroller.js";
import { addApplicant, getApplicants } from "../controller/applicantsController.js";

const router = express.Router();


// 🔔 Notification Settings
router.get("/settings", getNotificationSettings);

// ⭐ Favourites
router.post("/favourites", addFavourite);
router.get("/favourites", getFavourites);

// ⏰ Reminders
router.post("/reminders", addReminder);
router.get("/reminders", getReminders);
router.put("/reminders/:id/seen", markReminderSeen);

// 👤 Applicants
router.post("/applicants", addApplicant);
router.get("/applicants", getApplicants);


export default router;
