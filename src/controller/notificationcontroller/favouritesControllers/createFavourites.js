import Notification from "../../../model/notificationSchema.js";

const createFavourites = async (req, res) => {
  try {
    // Optional debug log
    console.log("Incoming body:", req.body);

    const favourite = new Notification({
      type: "favourites",
      message: req.body.message, // must come from body
      isFavourite: true,
    });

    await favourite.save();

    res.status(201).json({
      success: true,
      message: "Favourite created successfully",
      data: favourite,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export default createFavourites;
