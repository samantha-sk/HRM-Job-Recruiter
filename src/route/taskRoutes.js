import express from "express";

import createTask from "../controller/taskController/createTask.js";
import updateTask from "../controller/taskController/updateTask.js";
import deleteTask from "../controller/taskController/deleteTask.js";

const router = express.Router();

router.post("/submit", createTask);
//router.post("/:id/submit", submitTask);
//router.post("/:id/evaluate", evaluateTask);
router.put("/updateTask/:id", updateTask);
router.delete("/deleteTask/:id", deleteTask);

export default router;