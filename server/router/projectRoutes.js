import express from "express";
import { downloadFile, getAllProjects, markProjectCompleted } from "../controllers/projectController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authmiddleware.js";

const router = express.Router();

// Get all projects (Admin only)
router.get("/", isAuthenticated, isAuthorized("Admin"), getAllProjects);

// Mark project as completed (Teacher only)
router.put("/:projectId/complete", isAuthenticated, markProjectCompleted);

// Download file
router.get("/:projectId/files/:fileId/download", isAuthenticated, downloadFile);

export default router;