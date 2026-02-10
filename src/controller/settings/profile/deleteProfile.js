import Profile from "../../../model/profileModel.js";

const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Profile ID is required"
      });
    }

    const deletedProfile = await Profile.findByIdAndDelete(id);

    if (!deletedProfile) {
      return res.status(404).json({
        success: false,
        message: "ID not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export default deleteProfile;
