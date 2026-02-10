import Application from '../../model/applicantSchema.js';

/**
 * Get Interview Status Controller
 * This controller retrieves the interview status and details for a candidate
 */
const getInterviewStatus = async (req, res) => {
  try {
    const { applicantId } = req.params;

    if (!applicantId) {
      return res.status(400).json({ 
        success: false,
        message: 'applicantId is required' 
      });
    }

    // Find applicant by ID with job details
    const applicant = await Application.findById(applicantId)
      .populate('jobId', 'title location department')
      .lean();

    if (!applicant) {
      return res.status(404).json({ 
        success: false,
        message: 'Applicant not found' 
      });
    }

    const interviewInfo = {
      applicantId: applicant._id,
      applicantName: `${applicant.firstName} ${applicant.lastName}`,
      email: applicant.email,
      contactNumber: applicant.contactNumber,
      jobTitle: applicant.jobId?.title,
      profileStatus: applicant.profileStatus,
      interviewDetails: applicant.interviewDetails || {
        interviewStarted: false,
        interviewStatus: 'Not Started'
      },
      candidateFeedback: applicant.candidateFeedback,
      candidateRating: applicant.candidateRating
    };

    return res.status(200).json({
      success: true,
      message: 'Interview status retrieved successfully',
      data: interviewInfo
    });

  } catch (error) {
    console.error('getInterviewStatus error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to get interview status', 
      error: error.message 
    });
  }
};

export default getInterviewStatus;
