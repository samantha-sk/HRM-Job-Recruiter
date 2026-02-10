import MeetingSettings from "../../../model/meetingSettingsModel.js";

const updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Meeting ID is required",
      });
    }

    const existingMeeting = await MeetingSettings.findById(id);
    if (!existingMeeting) {
      return res.status(404).json({
        success: false,
        message: "ID not found",
      });
    }

    const requiredFields = [
      "defaultInterviewDuration",
      "meetingPlatform",
      "maxInterviewPerDay",
      "allowRescheduling",
      "calendarIntegration",
      "defaultCalendarView",
      "autoRecord",
      "requireConsent"
    ];
    for (const field of requiredFields) {
      if (!(field in req.body)) {
        return res.status(400).json({
          success: false,
          message: `Field "${field}" is required`,
        });
      }
    }
    const updatedMeeting = await MeetingSettings.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "ID found. Meeting updated successfully",
      data: updatedMeeting,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default updateMeeting;
