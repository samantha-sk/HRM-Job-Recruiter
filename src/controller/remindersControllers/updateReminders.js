import Notification from "../../model/notificationSchema.js";

export const updateReminders = async (req, res) => {
  try {
    const reminder = await Notification.findOneAndUpdate(
      { _id: req.params.id, type: "reminders" },
      req.body,
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ success: false, message: "Reminder not found" });
    }

    res.json({ success: true, message: "Reminder updated", data: reminder });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
