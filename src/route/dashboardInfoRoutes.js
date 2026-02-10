import express from "express";
import { 
    getUpcomingInterviews,
    getCompletedInterviews,
    getTodayInterviewSchedule,
    getTotalCandidatesCurrentMonth,
    getTotalCandidatesCurrentWeek,
    getInProcessCandidates,
    getShortlistedCandidates,
    getRejectedCandidates,
    getHiredCandidates,
    getCurrentWeekHired,
<<<<<<< HEAD
    getTotalHiredManagers,
    getMonthlyHired
=======
    getTotalHiredManagers
>>>>>>> 7fcaf4c (adding dashboard controllers and routes and also adding candidates feedback field in applicant schema)
} from "../controller/DashboardsController/dashboardInfoController.js";

const router = express.Router();

// Dashboard Info Routes
router.get("/upcomingInterview", getUpcomingInterviews);
router.get("/completedInterview", getCompletedInterviews);
router.get("/todayInterviewSchedule", getTodayInterviewSchedule);
router.get("/totalCandidatesInCurrentMonth", getTotalCandidatesCurrentMonth);
router.get("/totalCandidatesInCurrentWeek", getTotalCandidatesCurrentWeek);
router.get("/inProcess", getInProcessCandidates);
router.get("/shortlisted", getShortlistedCandidates);
router.get("/rejected", getRejectedCandidates);
router.get("/hired", getHiredCandidates);
router.get("/currentWeekHired", getCurrentWeekHired);
router.get("/totalHiredManager", getTotalHiredManagers);
<<<<<<< HEAD
router.get("/monthlyHired", getMonthlyHired);
=======

>>>>>>> 7fcaf4c (adding dashboard controllers and routes and also adding candidates feedback field in applicant schema)
export default router;
