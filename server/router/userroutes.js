import express from "express";
import {
  registerUser,
  forgotPassword,
  getUser,
  login,
  logout,
  resetPassword,
  guestLogin,
} from "../controllers/authcontroller.js";

import { isAuthenticated } from "../middlewares/authmiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/guest-login", guestLogin);
router.get("/me", isAuthenticated, getUser);
router.get("/logout", isAuthenticated, logout);
router.post("/password/forgot-password", forgotPassword);
router.put("/password/reset/:token", resetPassword);

export default router;
