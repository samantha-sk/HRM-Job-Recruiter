import { google } from 'googleapis';
import Application from '../../model/applicantSchema.js';
import InterviewSchedule from '../../model/InterviewScheduleSchema.js';
import Job from '../../model/jobSchema.js';

/**
 * Start Interview Controller
 * This controller handles starting an interview for a candidate
 * It creates a Google Meet link, updates the applicant record, and creates/updates interview schedule
 */
const startInterview = async (req, res) => {
  try {
    const { 
      applicantId, 
      interviewRound, 
      interviewer, 
      durationMinutes = 60,
      startImmediately = true 
    } = req.body;

    // Validate required fields
    if (!applicantId) {
      return res.status(400).json({ 
        success: false,
        message: 'applicantId is required' 
      });
    }

    // Find applicant by ID
    const applicant = await Application.findById(applicantId).populate('jobId');
    if (!applicant) {
      return res.status(404).json({ 
        success: false,
        message: 'Applicant not found with provided ID' 
      });
    }

    // Check if applicant is eligible for interview
    if (!['Shortlisted', 'Applied', 'Interview', 'Rescheduled'].includes(applicant.profileStatus)) {
      return res.status(400).json({ 
        success: false,
        message: `Cannot start interview. Current status: ${applicant.profileStatus}` 
      });
    }

    // Check if interview is already in progress
    if (applicant.interviewDetails?.interviewStatus === 'In Progress') {
      return res.status(400).json({ 
        success: false,
        message: 'Interview is already in progress for this applicant',
        data: {
          meetingLink: applicant.interviewDetails.meetingLink,
          startedAt: applicant.interviewDetails.interviewStartedAt
        }
      });
    }

    let meetLink = null;
    let eventId = null;

    // Create Google Meet link if credentials are configured
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
      try {
        const oAuth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_REDIRECT_URI
        );
        oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        const startTime = startImmediately 
          ? new Date(Date.now() + 2 * 60 * 1000) // 2 minutes from now
          : new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

        const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

        const event = {
          summary: `Interview: ${applicant.firstName} ${applicant.lastName} - ${applicant.jobId?.title || 'Position'}`,
          description: `Interview for ${applicant.firstName} ${applicant.lastName}\nApplicant ID: ${applicantId}\nRound: ${interviewRound || 'Initial Screening'}\nInterviewer: ${interviewer || 'TBD'}`,
          start: {
            dateTime: startTime.toISOString(),
            timeZone: 'Asia/Kolkata',
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: 'Asia/Kolkata',
          },
          conferenceData: {
            createRequest: {
              requestId: `meet-${applicantId}-${Date.now()}`,
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          },
          attendees: [
            { email: applicant.email },
          ],
        };

        const response = await calendar.events.insert({
          calendarId: 'primary',
          resource: event,
          conferenceDataVersion: 1,
          sendUpdates: 'all',
        });

        meetLink = response.data.hangoutLink;
        eventId = response.data.id;
      } catch (googleError) {
        console.warn('Google Meet creation failed, proceeding without meeting link:', googleError.message);
        // Continue without Google Meet link
      }
    }

    // Update applicant with interview details
    applicant.interviewDetails = {
      interviewStarted: true,
      interviewStartedAt: new Date(),
      interviewStatus: 'In Progress',
      meetingLink: meetLink || `https://meet.google.com/placeholder-${Date.now()}`,
      eventId: eventId,
      interviewRound: interviewRound || 'Initial Screening',
      interviewer: interviewer || null,
      interviewNotes: '',
      interviewDuration: durationMinutes,
    };

    // Update profile status to Interview
    applicant.profileStatus = 'Interview';

    await applicant.save();

    // Create or update interview schedule record
    const interviewScheduleData = {
      candidateName: `${applicant.firstName} ${applicant.lastName}`,
      position: applicant.jobId?.title || 'Position',
      recruiterName: interviewer || 'HR Team',
      interviewDate: new Date().toISOString().split('T')[0],
      interviewTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
      meetingMode: 'Online',
      durationMinutes: durationMinutes,
      sendNotification: true,
      status: 'Scheduled',
      meetingLink: meetLink || `https://meet.google.com/placeholder-${Date.now()}`,
      eventId: eventId,
    };

    const interviewSchedule = await InterviewSchedule.create(interviewScheduleData);

    return res.status(200).json({
      success: true,
      message: 'Interview started successfully',
      data: {
        applicantId: applicant._id,
        applicantName: `${applicant.firstName} ${applicant.lastName}`,
        jobTitle: applicant.jobId?.title,
        interviewStatus: applicant.interviewDetails.interviewStatus,
        meetingLink: applicant.interviewDetails.meetingLink,
        eventId: applicant.interviewDetails.eventId,
        interviewRound: applicant.interviewDetails.interviewRound,
        interviewer: applicant.interviewDetails.interviewer,
        startedAt: applicant.interviewDetails.interviewStartedAt,
        duration: applicant.interviewDetails.interviewDuration,
        scheduleId: interviewSchedule._id
      }
    });

  } catch (error) {
    console.error('startInterview error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to start interview', 
      error: error.message 
    });
  }
};

export default startInterview;