import express from "express";
import createEmployee from "../controller/employeeController/createEmployee.js";
import getEmployees from "../controller/employeeController/getEmployee.js";
import putEmployee from "../controller/employeeController/updateEmployee.js";
import deleteEmployee from "../controller/employeeController/deleteEmployee.js";

const router = express.Router();

router.post("/createemployee", createEmployee);
router.get("/getemployee", getEmployees);
router.put("/putemployee/:id", putEmployee);
router.delete("/deleteemployee/:id", deleteEmployee);

export default router;
