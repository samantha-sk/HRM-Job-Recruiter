import Notification from "../../model/notificationSchema.js";

export const createFavourites = async (req, res) => {
  try {
    console.log("Incoming body:", req.body); // 👈 debug log

    const favourite = new Notification({
      type: "favourites",
      message: req.body.message,   // must come from body
      isFavourite: true,
    });

    await favourite.save();

    res.status(201).json({
      success: true,
      message: "Favourite created successfully",
      data: favourite
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
