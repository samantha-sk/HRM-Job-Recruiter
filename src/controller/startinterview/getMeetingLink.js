import InterviewSchedule from '../../model/InterviewScheduleSchema.js';
import Application from '../../model/applicantSchema.js';

/**
 * Get Meeting Link Controller
 * This controller retrieves the meeting link for a candidate's interview
 * Can fetch from either InterviewSchedule or ApplicantSchema
 */
const getMeetingLink = async (req, res) => {
  try {
    const { applicantId, scheduleId } = req.query;

    if (!applicantId && !scheduleId) {
      return res.status(400).json({ 
        success: false,
        message: 'Either applicantId or scheduleId is required' 
      });
    }

    let meetingLink = null;
    let eventId = null;
    let source = null;

    // If scheduleId is provided, fetch from InterviewSchedule
    if (scheduleId) {
      const schedule = await InterviewSchedule.findById(scheduleId);
      if (schedule) {
        meetingLink = schedule.meetingLink;
        eventId = schedule.eventId;
        source = 'InterviewSchedule';
      }
    }

    // If applicantId is provided or scheduleId not found, fetch from ApplicantSchema
    if (!meetingLink && applicantId) {
      const applicant = await Application.findById(applicantId);
      if (applicant && applicant.interviewDetails?.meetingLink) {
        meetingLink = applicant.interviewDetails.meetingLink;
        eventId = applicant.interviewDetails.eventId;
        source = 'ApplicantSchema';
      }
    }

    if (!meetingLink) {
      return res.status(404).json({ 
        success: false,
        message: 'Meeting link not found' 
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Meeting link retrieved successfully',
      data: {
        meetingLink,
        eventId,
        source
      }
    });

  } catch (error) {
    console.error('getMeetingLink error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to get meeting link', 
      error: error.message 
    });
  }
};

export default getMeetingLink;
