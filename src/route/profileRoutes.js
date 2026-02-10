import express from "express";
import addProfile from "../controller/settings/profile/addProfile.js";
import getProfileById from "../controller/settings/profile/getProfile.js";
import updateProfile from "../controller/settings/profile/updateProfile.js";
import deleteProfile from "../controller/settings/profile/deleteProfile.js";

const router = express.Router();

router.post("/create", addProfile);
router.get("/get/:id", getProfileById);
router.put("/update/:id", updateProfile);
router.delete("/delete/:id", deleteProfile);

export default router;
