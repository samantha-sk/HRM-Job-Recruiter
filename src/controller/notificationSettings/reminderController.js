import notification from "../model/reminderSchema.js";

export const addReminder = async (req, res) => {
  try {
    const reminder = new notification({
      type: "reminder",
      applicantId: req.body.applicantId,
      message: req.body.message,
      dateTime: req.body.dateTime
    });
    await reminder.save();
    res.status(201).json({
      success: true,
      message: "Reminder added successfully",
      data: reminder
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getReminders = async (req, res) => {
  try {
    const reminders = await notification.find({ type: "reminder" }).populate("applicantId");
    res.json({
      success: true,
      message: "Reminders fetched successfully",
      data: reminders
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const markReminderSeen = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await notification.findByIdAndUpdate(
      id,
      { seen: true },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found"
      });
    }

    res.json({
      success: true,
      message: "Reminder marked as seen",
      data: reminder
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
