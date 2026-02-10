import Notification from "../../model/notificationSchema.js";

export const markRemindersAsSeen = async (req, res) => {
  try {
    const reminder = await Notification.findOneAndUpdate(
      { _id: req.params.id, type: "reminders" },
      { isSeen: true },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ success: false, message: "Reminder not found" });
    }

    res.json({ success: true, message: "Reminder marked as seen", data: reminder });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
