import notificationSettings from "../../../model/notificationSettings.js";

const getNotification = async (req, res) => {
  try {
    const { userId } = req.params;

    const settings = await notificationSettings.findOne({ userId });

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Notification settings not found",
      });
    }

    res.json({
      success: true,
      message: "Notification settings fetched successfully",
      data: settings,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export default getNotification;
