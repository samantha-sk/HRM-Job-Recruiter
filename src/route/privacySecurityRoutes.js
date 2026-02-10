// src/route/privacySecurityRoutes.js
import express from "express";
import getPrivacy from "../controller/settings/privacySecurity/getPrivacy.js";
import addPrivacy from "../controller/settings/privacySecurity/addPrivacy.js";
import updatePrivacy from "../controller/settings/privacySecurity/updatePrivacy.js";
import deletePrivacy from "../controller/settings/privacySecurity/deletePrivacy.js";

const router = express.Router();
router.post("/create", addPrivacy);
router.get("/get/:id", getPrivacy);
router.put("/update/:id", updatePrivacy);
router.delete("/delete/:id", deletePrivacy);

export default router;
