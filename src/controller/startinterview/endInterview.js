import Application from '../../model/applicantSchema.js';

/**
 * End Interview Controller
 * This controller handles ending an ongoing interview for a candidate
 */
const endInterview = async (req, res) => {
  try {
    const { applicantId, interviewNotes, feedback } = req.body;

    // Validate required fields
    if (!applicantId) {
      return res.status(400).json({ 
        success: false,
        message: 'applicantId is required' 
      });
    }

    // Find applicant by ID
    const applicant = await Application.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({ 
        success: false,
        message: 'Applicant not found with provided ID' 
      });
    }

    // Check if interview is in progress
    if (applicant.interviewDetails?.interviewStatus !== 'In Progress') {
      return res.status(400).json({ 
        success: false,
        message: `Cannot end interview. Current status: ${applicant.interviewDetails?.interviewStatus || 'Not Started'}` 
      });
    }

    // Calculate interview duration if started
    let actualDuration = null;
    if (applicant.interviewDetails.interviewStartedAt) {
      const endTime = new Date();
      const startTime = new Date(applicant.interviewDetails.interviewStartedAt);
      actualDuration = Math.round((endTime - startTime) / (1000 * 60)); // in minutes
    }

    // Update interview details
    applicant.interviewDetails.interviewStatus = 'Completed';
    applicant.interviewDetails.interviewEndedAt = new Date();
    applicant.interviewDetails.interviewDuration = actualDuration || applicant.interviewDetails.interviewDuration;
    
    if (interviewNotes) {
      applicant.interviewDetails.interviewNotes = interviewNotes;
    }

    // Update feedback if provided
    if (feedback) {
      if (feedback.communication) applicant.candidateFeedback.communication = feedback.communication;
      if (feedback.technical) applicant.candidateFeedback.technical = feedback.technical;
      if (feedback.programming) applicant.candidateFeedback.programming = feedback.programming;
      if (feedback.problemSolving) applicant.candidateFeedback.problemSolving = feedback.problemSolving;
      if (feedback.feedbackDescription) applicant.candidateFeedback.feedbackDescription = feedback.feedbackDescription;
      if (feedback.candidateRating) applicant.candidateRating = feedback.candidateRating;
    }

    await applicant.save();

    return res.status(200).json({
      success: true,
      message: 'Interview ended successfully',
      data: {
        applicantId: applicant._id,
        applicantName: `${applicant.firstName} ${applicant.lastName}`,
        interviewStatus: applicant.interviewDetails.interviewStatus,
        startedAt: applicant.interviewDetails.interviewStartedAt,
        endedAt: applicant.interviewDetails.interviewEndedAt,
        duration: applicant.interviewDetails.interviewDuration,
        interviewRound: applicant.interviewDetails.interviewRound,
        candidateRating: applicant.candidateRating
      }
    });

  } catch (error) {
    console.error('endInterview error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to end interview', 
      error: error.message 
    });
  }
};

export default endInterview;
