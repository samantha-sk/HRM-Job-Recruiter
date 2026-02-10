import Notification from "../../../model/notificationSchema.js";

const deleteFavourites = async (req, res) => {
  try {
    const deletedFavourite = await Notification.findByIdAndDelete(req.params.id);

    if (!deletedFavourite) {
      return res.status(404).json({
        success: false,
        message: "Favourite not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Favourite deleted successfully",
      data: deletedFavourite,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export default deleteFavourites;
