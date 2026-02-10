import Notification from "../../model/notificationSchema.js";

export const getReminders = async (req, res) => {
  try {
    if (req.params.id) {
      const reminder = await Notification.findOne({ _id: req.params.id, type: "reminders" });
      if (!reminder) {
        return res.status(404).json({ success: false, message: "Reminder not found" });
      }
      return res.json({ success: true, data: reminder });
    }

    const reminders = await Notification.find({ type: "reminders" });
    res.json({ success: true, data: reminders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
