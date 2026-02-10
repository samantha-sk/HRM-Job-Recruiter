import Notification from "../../../model/notificationSchema.js";

const markRemindersAsSeen = async (req, res) => {
  try {
    const updatedReminder = await Notification.findOneAndUpdate(
      { _id: req.params.id, type: "reminders" },
      { isSeen: true },
      { new: true }
    );

    if (!updatedReminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reminder marked as seen",
      data: updatedReminder,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export default markRemindersAsSeen;
