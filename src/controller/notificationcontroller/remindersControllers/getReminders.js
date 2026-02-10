import Notification from "../../../model/notificationSchema.js";

const getReminders = async (req, res) => {
  try {
    let reminders;

    if (req.params.id) {
      reminders = await Notification.findOne({ _id: req.params.id, type: "reminders" });

      if (!reminders) {
        return res.status(404).json({
          success: false,
          message: "Reminder not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Reminder fetched successfully",
        data: reminders,
      });
    }

    reminders = await Notification.find({ type: "reminders" });

    res.status(200).json({
      success: true,
      message: "Reminders fetched successfully",
      data: reminders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export default getReminders;
