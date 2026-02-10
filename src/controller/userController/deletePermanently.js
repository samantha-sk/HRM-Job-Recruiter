import userModel from "../../model/userModel.js";
const deletePermanentlyAccount = async (req, res) => {
  try {
    const { businessEmail } = req.body;

    const user = await userModel.findOneAndDelete({ businessEmail });
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json({ msg: "User account permanently deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
export default deletePermanentlyAccount;
