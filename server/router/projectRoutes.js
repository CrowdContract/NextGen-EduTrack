import express from "express";

import {
  downloadFile,
  getAllProjects,
} from "../controllers/projectController.js";

import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authmiddleware.js";

const router = express.Router();

// 🔹 Get all projects (Admin only)
router.get(
  "/",
  isAuthenticated,
  isAuthorized("Admin"),
  getAllProjects
);

// 🔹 Download file
router.get(
  "/:projectId/files/:fileId/download",
  isAuthenticated,
  downloadFile
);

export default router;