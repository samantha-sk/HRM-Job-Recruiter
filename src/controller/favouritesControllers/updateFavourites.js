import  Notification from "../../model/notificationSchema.js";

export const updateFavourites = async (req, res) => {
  try {
    const updatedFavourites = await Notification.findByIdAndUpdate(
      { _id: req.params.id, type: "favourites" }, 
      {
        applicantId: req.body.applicantId,
        isFavourite: req.body.isFavourite,
        isSeen: req.body.isSeen  
      },
      { new: true }
    );

    if (!updatedFavourites) {
      return res.status(404).json({
        success: false,
        message: "Favourite not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Favourite updated successfully",
      data: updatedFavourites
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};