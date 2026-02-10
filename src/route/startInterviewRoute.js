import express from 'express';
import startInterview from '../controller/startinterview/startInterview.js';
import endInterview from '../controller/startinterview/endInterview.js';
import getInterviewStatus from '../controller/startinterview/getInterviewStatus.js';
import getAllInterviews from '../controller/startinterview/getAllInterviews.js';
import getMeetingLink from '../controller/startinterview/getMeetingLink.js';

const router = express.Router();

// POST /api/interview/start - Start an interview for a candidate
router.post('/interview/start', startInterview);

// POST /api/interview/end - End an ongoing interview
router.post('/interview/end', endInterview);

// GET /api/interview/status/:applicantId - Get interview status for a specific candidate
router.get('/interview/status/:applicantId', getInterviewStatus);

// GET /api/interview/all - Get all interviews with filtering
router.get('/interview/all', getAllInterviews);

// GET /api/interview/meeting-link - Get meeting link by applicantId or scheduleId
router.get('/interview/meeting-link', getMeetingLink);

export default router;
