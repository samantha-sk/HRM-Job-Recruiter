import  Notification from "../../model/notificationSchema.js";

export const deleteFavourites = async (req, res) => {
  try {
    const deletedFavourites = await Notification.findByIdAndDelete(req.params.id);

    if (!deletedFavourites) {
      return res.status(404).json({ success: false, message: "Favourite not found" });
    }

    res.status(200).json({
      success: true,
      message: "Favourite deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};