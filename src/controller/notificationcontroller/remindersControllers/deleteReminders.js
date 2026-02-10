import Notification from "../../../model/notificationSchema.js";

const deleteReminders = async (req, res) => {
  try {
    const deletedReminder = await Notification.findOneAndDelete({ _id: req.params.id, type: "reminders" });

    if (!deletedReminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reminder deleted successfully",
      data: deletedReminder,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export default deleteReminders;
