import mongoose from "mongoose";
import Screening from "../../model/screenSchema.js";

const deleteScreen = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid screening ID!" });
    }

    const screening = await Screening.findByIdAndDelete(id);
    if (!screening) {
      return res.status(404).json({ success: false, message: "Screening question not found!" });
    }

    res.status(200).json({
      success: true,
      message: "Screening question deleted successfully!",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, message: "Unable to delete question!" });
  }
};

export default deleteScreen;