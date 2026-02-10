import Screening from "../../model/screenSchema.js";

const createScreen = async (req, res) => {
  try {
    const { addQuestions = [], rounds = [] } = req.body;

    if (!rounds.length) {
      return res.status(400).json({ success: false, message: "At least one round is required!" });
    }

    const screening = new Screening({
      addQuestions,
      rounds,
    });

    await screening.save();

    res.status(201).json({
      success: true,
      message: "Screening question created successfully!",
      data: screening,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message, message: "Unable to add question!" });
  }
};

export default createScreen;