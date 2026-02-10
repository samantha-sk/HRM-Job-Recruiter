import Notification from "../../model/notificationSchema.js";

export const createReminders = async (req, res) => {
  try {
    const reminder = new Notification({
      type: "reminders",
      message: req.body.message,
      dateTime: req.body.dateTime || Date.now()
    });

    await reminder.save();

    res.status(201).json({
      success: true,
      message: "Reminder created successfully",
      data: reminder
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
