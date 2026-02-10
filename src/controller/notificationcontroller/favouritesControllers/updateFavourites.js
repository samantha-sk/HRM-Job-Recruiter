import Notification from "../../../model/notificationSchema.js";

const updateFavourites = async (req, res) => {
  try {
    const updatedFavourite = await Notification.findOneAndUpdate(
      { _id: req.params.id, type: "favourites" },
      {
        applicantId: req.body.applicantId,
        isFavourite: req.body.isFavourite,
        isSeen: req.body.isSeen,
      },
      { new: true }
    );

    if (!updatedFavourite) {
      return res.status(404).json({
        success: false,
        message: "Favourite not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Favourite updated successfully",
      data: updatedFavourite,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export default updateFavourites;
