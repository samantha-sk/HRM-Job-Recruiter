import express from 'express';
import postSchedule from "../controller/controllerSchedule/postScheduleController.js";
import getSchedule from '../controller/controllerSchedule/getScheduleController.js';
import getScheduleByStatus from '../controller/controllerSchedule/getScheduleStatusController.js';

const daySelector = express.Router();

daySelector.post('/postschedule', postSchedule);
daySelector.get('/getschedule', getSchedule);
daySelector.get('/getStatusSchedule',getScheduleByStatus);

export default daySelector;
