import mongoose from "mongoose";
import Screening from "../../model/screenSchema.js";

const updateScreen = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid screening ID!" });
    }

    const screening = await Screening.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("rounds.tasks");

    if (!screening) {
      return res.status(404).json({ success: false, message: "Screening question not found!" });
    }

    res.status(200).json({
      success: true,
      message: "Screening question updated successfully!",
      data: screening,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message, message: "Unable to update question!" });
  }
};

export default updateScreen;