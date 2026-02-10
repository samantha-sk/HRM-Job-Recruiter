import  Notification  from "../../model/notificationSchema.js";

export const markFavouritesAsSeen = async (req, res) => {
  try {
    const updatedFavourite = await Notification.findByIdAndUpdate(
      { _id: req.params.id, type: "favourites" },
      { isSeen: true },
      { new: true }
    );

    if (!updatedFavourite) {
      return res.status(404).json({
        success: false,
        message: "Favourite notification not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Favourite notification marked as seen",
      data: updatedFavourite
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};