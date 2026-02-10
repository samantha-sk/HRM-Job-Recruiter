import express from "express";
import createScreen from "../controller/screenController/createScreen.js";
import getScreenById from "../controller/screenController/getScreen.js";
import updateScreen from "../controller/screenController/updateScreen.js";
import deleteScreen from "../controller/screenController/deleteScreen.js";

const router = express.Router();

router.post("/createQuestion", createScreen);      
router.get("/displayQuestion/:id", getScreenById); 
router.put("/updateQuestion/:id", updateScreen);  
router.delete("/deleteQuestion/:id", deleteScreen);

export default router;