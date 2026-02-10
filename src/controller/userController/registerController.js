import jwt from "jsonwebtoken";
import User from "../../model/userModel.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const registerController = async (req, res) => {
  const {
    userName,
    businessEmail,
    organizationName,
    role,
    noOfEmployees,
    department,
    contactNumber,
    createNewPassword,
    confirmNewPassword,
  } = req.body;

  if (
    !userName ||
    !businessEmail ||
    !organizationName ||
    !role ||
    !noOfEmployees ||
    !department ||
    !contactNumber ||
    !createNewPassword ||
    !confirmNewPassword
  ) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  const existing = await User.findOne({ businessEmail });

  if (existing) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exist" });
  }

  const hashed = await bcrypt.hash(createNewPassword, 10);

  const user = await User.create({
    userName,
    businessEmail,
    organizationName,
    role,
    department,
    noOfEmployees,
    contactNumber,
    password: hashed,
  });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: businessEmail,
    subject: "verify your email",
    html: `<a href=${process.env.CLIENT_URL}/api/verify-email/${token}>Click to verify</a>`,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.status(500).json({ message: "Email sending failed", err });
    }
    return res.status(201).json({
      success: true,
      message: "User registered. Verification sent to mail",
      token,
    });
  });
};
export default registerController;
