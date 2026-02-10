import express from "express";
const Router = express.Router();

import registerController from "../controller/userController/registerController.js";
import loginController from "../controller/userController/loginController.js";
import verifyEmail from "../controller/userController/verifyEmailController.js";
import forgotPassword from "../controller/userController/forgotPassword.js";
import resetPassword from "../controller/userController/resetPasswordController.js";
import verifyTwoFactor from "../controller/userController/twoFactorController.js";
import deactivateAccount from "../controller/userController/deactivate.js";
import deletePermanentlyAccount from "../controller/userController/deletePermanently.js";

Router.post("/register", registerController);
Router.post("/login", loginController);
Router.get("/verify-email", verifyEmail);
Router.post("/forgot-password", forgotPassword);
Router.post("/reset-password", resetPassword);
Router.post("/twofactor",verifyTwoFactor)
Router.put("/deactivate",deactivateAccount)
Router.delete("/delete",deletePermanentlyAccount)

export default Router;
