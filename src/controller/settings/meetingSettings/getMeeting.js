import mongoose from "mongoose";
import MeetingSettings from "../../../model/meetingSettingsModel.js";

const getMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID format"
        });
      }

      const meeting = await MeetingSettings.findById(id);

      if (!meeting) {
        return res.status(404).json({
          success: false,
          message: "Meeting not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Meeting found",
        data: meeting
      });
    }

    const meetings = await MeetingSettings.find();

    return res.status(200).json({
      success: true,
      message: "All meetings fetched successfully",
      count: meetings.length,
      data: meetings
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

export default getMeeting;
