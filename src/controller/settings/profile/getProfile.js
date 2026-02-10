import profileModel from '../../../model/profileModel.js';

const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await profileModel.findById(id);

    if (profile) {
      res.status(200).json({
        success: true,
        message: "ID Found",
        data: profile,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "ID not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default getProfileById;
