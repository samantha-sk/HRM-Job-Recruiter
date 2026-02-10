import MeetingSettings from "../../../model/meetingSettingsModel.js";

const addMeeting = async (req, res) => {
  try {
    const {
      defaultInterviewDuration,
      meetingPlatform,
      maxInterviewPerDay,
      allowRescheduling,
      calendarIntegration,
      defaultCalendarView,
      autoRecord,
      requireConsent
    } = req.body;
    if (
      !defaultInterviewDuration ||
      !meetingPlatform ||
      !maxInterviewPerDay ||
      allowRescheduling === undefined ||
      !calendarIntegration ||
      !defaultCalendarView ||
      autoRecord === undefined ||
      requireConsent === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const newMeeting = new MeetingSettings({
      defaultInterviewDuration,
      meetingPlatform,
      maxInterviewPerDay,
      allowRescheduling,
      calendarIntegration,
      defaultCalendarView,
      autoRecord,
      requireConsent
    });

    await newMeeting.save();

    res.status(201).json({
      success: true,
      message: "Meeting settings created successfully",
      data: newMeeting
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

export default addMeeting;
