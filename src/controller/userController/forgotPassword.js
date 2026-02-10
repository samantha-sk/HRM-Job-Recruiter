import userModel from "../../model/userModel.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const forgotPassword = async (req, res) => {
  try {
    const { businessEmail } = req.body;

    if (!businessEmail) {
      return res.status(400).json({ message: "Please provide businessEmail" });
    }

    const user = await userModel.findOne({ businessEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    if (!process.env.CLIENT_URL) {
      return res.status(500).json({ message: "CLIENT_URL not configured" });
    }

    const resetUrl = `${process.env.CLIENT_URL}/api/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.businessEmail,
      subject: "Reset your password",
      html: `<p><a href="${resetUrl}">Click to reset password</a></p>`,
    });

    return res.status(200).json({
      message: "Reset password email sent",
      resetToken,
    });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export default forgotPassword;
