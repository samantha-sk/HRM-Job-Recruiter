import favourite from "../model/favouriteSchema.js";

export const addFavourite = async (req, res) => {
  try {
    const fav = new favourite({
      type: "favourite",
      applicantId: req.body.applicantId,
      isFavourite: true,
      addedAt: new Date()
    });

    await fav.save();

    res.status(201).json({
      success: true,
      message: "Favourite added successfully",
      data: fav
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getFavourites = async (req, res) => {
  try {
    const favs = await favourite.find({ type: "favourite" })
      .populate("applicantId");

    res.json({
      success: true,
      message: "Favourites fetched successfully",
      data: favs
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
