import express from "express";

// Applicants
import { createApplicants } from "../controller/applicantsControllers/createApplicants.js";
import { getApplicants } from "../controller/applicantsControllers/getApplicants.js";
import { updateApplicants } from "../controller/applicantsControllers/updateApplicants.js";
import { deleteApplicants } from "../controller/applicantsControllers/deleteApplicants.js";
import { markApplicantsAsSeen } from "../controller/applicantsControllers/markApplicantsAsSeen.js";

// Favourites
import { createFavourites } from "../controller/favouritesControllers/createFavourites.js";
import { getFavourites } from "../controller/favouritesControllers/getFavourites.js";
import { updateFavourites } from "../controller/favouritesControllers/updateFavourites.js";
import { deleteFavourites } from "../controller/favouritesControllers/deleteFavourites.js";
import { markFavouritesAsSeen } from "../controller/favouritesControllers/markFavouritesAsSeen.js";

// Reminders
import { createReminders } from "../controller/remindersControllers/createReminders.js";
import { getReminders } from "../controller/remindersControllers/getReminders.js";
import { updateReminders } from "../controller/remindersControllers/updateReminders.js";
import { deleteReminders } from "../controller/remindersControllers/deleteReminders.js";
import { markRemindersAsSeen } from "../controller/remindersControllers/markRemindersAsSeen.js";

const router = express.Router();

// Applicants Routes
router.post("/applicants", createApplicants);
router.get("/applicants", getApplicants);
router.get("/applicants/:id", getApplicants);
router.put("/applicants/:id", updateApplicants);
router.delete("/applicants/:id", deleteApplicants);
router.patch("/applicants/:id/seen", markApplicantsAsSeen);

// Favourites Routes
router.post("/favourites", createFavourites);
router.get("/favourites", getFavourites);
router.get("/favourites/:id", getFavourites);  
router.put("/favourites/:id", updateFavourites);
router.delete("/favourites/:id", deleteFavourites);
router.patch("/favourites/:id/seen", markFavouritesAsSeen);

// Reminders Routes
router.post("/reminders", createReminders);
router.get("/reminders", getReminders);
router.get("/reminders/:id", getReminders);
router.put("/reminders/:id", updateReminders);
router.delete("/reminders/:id", deleteReminders);
router.patch("/reminders/:id/seen", markRemindersAsSeen);

export default router;