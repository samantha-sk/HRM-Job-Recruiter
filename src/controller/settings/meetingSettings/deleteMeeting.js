import MeetingSettings from "../../../model/meetingSettingsModel.js";

const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const meeting = await MeetingSettings.findById(id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "ID not found"
      });
    }

    await MeetingSettings.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "ID is present",
      otherMessage: "Meeting deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

export default deleteMeeting;
