import express from 'express'
import getSchedulePageTasks from '../controller/todayScheduleController/postTodayScheduleController.js';

const route = express.Router();

route.get('/postmethod',getSchedulePageTasks);

export default route;