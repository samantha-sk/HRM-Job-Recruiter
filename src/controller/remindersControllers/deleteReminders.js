import Notification from "../../model/notificationSchema.js";

export const deleteReminders = async (req, res) => {
  try {
    const reminder = await Notification.findOneAndDelete({ _id: req.params.id, type: "reminders" });

    if (!reminder) {
      return res.status(404).json({ success: false, message: "Reminder not found" });
    }

    res.json({ success: true, message: "Reminder deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
