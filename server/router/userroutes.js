import express from "express";
import {
  registerUser,
  forgotPassword,
  getUser,
  login,
  logout,
  resetPassword
} from "../controllers/authcontroller.js";

import multer from "multer";
import { isAuthenticated } from "../middlewares/authmiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/me",isAuthenticated, getUser);
router.get("/logout",isAuthenticated, logout);
router.post("/password/forgot-password", forgotPassword);
router.put("/password/reset/:token", resetPassword);

export default router;
