import userModel from "../../model/userModel.js";
import jwt from "jsonwebtoken";

const verifyTwoFactor = async (req, res) => {
  try {
    const { businessEmail, otp } = req.body;

    
    const user = await userModel.findOne({ businessEmail });
    if (!user) return res.status(400).json({ message: "User not found" });


    if (!user.twoFactorCode || user.twoFactorCode !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.twoFactorExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }


    user.twoFactorCode = null;
    user.twoFactorExpiry = null;
    await user.save();

    
    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(200).json({
      message: "Two-factor authentication verified successfully",
      token,
      user: {
        id: user._id,
        businessEmail: user.businessEmail,
        name: user.name || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default verifyTwoFactor;
