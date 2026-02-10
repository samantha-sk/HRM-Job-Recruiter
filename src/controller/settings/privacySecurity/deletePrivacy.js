import privacySecurityModel from '../../../model/privacySecurityModel.js';

const deletePrivacySecurity = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required"
      });
    }
    const privacy = await privacySecurityModel.findByIdAndDelete(id);

    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: "ID not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Privacy settings deleted successfully",
      data: privacy
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
};

export default deletePrivacySecurity;
