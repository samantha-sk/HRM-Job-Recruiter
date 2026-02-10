import Notification from "../../../model/notificationSchema.js";

const updateReminders = async (req, res) => {
  try {
    const updatedReminder = await Notification.findOneAndUpdate(
      { _id: req.params.id, type: "reminders" },
      req.body,
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
      message: "Reminder updated successfully",
      data: updatedReminder,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export default updateReminders;
