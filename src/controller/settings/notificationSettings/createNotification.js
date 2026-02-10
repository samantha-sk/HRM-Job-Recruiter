import notificationSettings from "../../../model/notificationSettings.js";

const createNotification = async (req, res) => {
  try {
    const {
      userId,
      dailyInterviewUpdate,
      newEventCreated,
      whenAddedOnNewTeam,
      mobilePush,
      desktopNotification,
      emailNotification,
      notifyBeforeInterview,
      firstReminder,
      secondReminder,
    } = req.body;

    const exists = await notificationSettings.findOne({ userId });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Settings already exist for this user",
      });
    }

    const settings = new notificationSettings({
      userId,
      dailyInterviewUpdate,
      newEventCreated,
      whenAddedOnNewTeam,
      mobilePush,
      desktopNotification,
      emailNotification,
      notifyBeforeInterview,
      firstReminder,
      secondReminder,
    });

    await settings.save();

    res.status(201).json({
      success: true,
      message: "Notification settings created successfully",
      data: settings,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export default createNotification;
