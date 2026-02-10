import userModel from "../../model/userModel.js";
const deactivateAccount = async (req, res) => {
  try {
    const { businessEmail } = req.body;

    const user = await userModel.findOne({ businessEmail });
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isDeactivated = true;
    await user.save();

    res.status(200).json({ msg: "Account deactivated temporarily" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
export default deactivateAccount;
