import Notification from "../../../model/notificationSchema.js";

const getFavourites = async (req, res) => {
  try {
    const { id } = req.params;
    let favouritesList;

    if (id) {
      // Try to find by Notification _id
      favouritesList = await Notification.findOne({ _id: id, type: "favourites" })
        .populate("applicantId");

      // If not found, try to match applicantId
      if (!favouritesList) {
        favouritesList = await Notification.findOne({ applicantId: id, type: "favourites" })
          .populate("applicantId");
      }

      if (!favouritesList) {
        return res.status(404).json({
          success: false,
          message: "Favourite not found",
        });
      }
    } else {
      // No id → return all favourites
      favouritesList = await Notification.find({ type: "favourites" })
        .populate("applicantId");
    }

    res.status(200).json({
      success: true,
      message: "Favourites fetched successfully",
      data: favouritesList,
    });
  } catch (err) {
    console.error("Error fetching favourites:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export default getFavourites;
