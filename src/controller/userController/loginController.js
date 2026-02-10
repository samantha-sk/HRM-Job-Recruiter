import userModel from "../../model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const login = async (req, res) => {
  try {
    const { businessEmail, password } = req.body;
    if (!businessEmail || !password)
      return res.status(400).json({ message: "Please fill all the fields" });
    const user = await userModel.findOne({ businessEmail });
    if (!user) return res.status(404).json({ message: "user not found" });

    if (!user.isVerified) {
      return res.status(401).json({ message: "Email is not verified" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN
    );
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    if (user.twoFactorEnabled) {
      user.twoFactorCode = otp;
      user.twoFactorExpiry = Date.now() + 5 * 60 * 1000;
      await user.save();

      //return res.status(200).json({ msg: "OTP sent for verification", otp });//
    }
    return res.status(200).json({ message: "Login successfull", token, otp });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export default login;
