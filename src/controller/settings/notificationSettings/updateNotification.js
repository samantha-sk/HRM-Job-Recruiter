import notificationSettings from "../../../model/notificationSettings.js";

const updateNotification = async (req, res) => {
  try {
    const { userId } = req.params;

    const updatedSettings = await notificationSettings.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedSettings) {
      return res.status(404).json({
        success: false,
        message: "Notification settings not found for this user",
      });
    }

    res.json({
      success: true,
      message: "Notification settings updated successfully",
      data: updatedSettings,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export default updateNotification;
