import notificationSettings from "../../../model/notificationSettings.js";

const deleteNotification = async (req, res) => {
  try {
    const { userId } = req.params;

    const deleted = await notificationSettings.findOneAndDelete({ userId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Notification settings not found for this user",
      });
    }

    res.json({
      success: true,
      message: "Notification settings deleted successfully",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export default deleteNotification;
