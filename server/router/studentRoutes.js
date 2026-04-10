import express from "express";
import {
  getStudentProject,
  submitProposal,
  uploadFiles,
  getSupervisor,
  requestSupervisor,
  getAvailableSupervisors,
   getFeedback,           
  getDashboardStats,
  downloadFile
} from "../controllers/studentController.js";
import multer from "multer";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authmiddleware.js";

import {
handleUploadError,upload
} from "../middlewares/upload.js";
const router = express.Router();

// Get student project (Admin access)
router.get(
  "/project",
  isAuthenticated,
  isAuthorized("Student"),
  getStudentProject
);

// Submit proposal (Student)
router.post(
  "/project-proposal",
  isAuthenticated,
  isAuthorized("Student"),
  submitProposal
);

// Upload files (Student)
router.post(
  "/upload/:projectId",
  isAuthenticated,
  isAuthorized("Student"),
  upload.array("files", 10),
   handleUploadError,
  uploadFiles
);

// Get available supervisors (Student)
router.get(
  "/fetch-supervisors",
  isAuthenticated,
  isAuthorized("Student"),
  getAvailableSupervisors
);
router.get(
  "/supervisor",
  isAuthenticated,
  isAuthorized("Student"),
  getSupervisor
);
router.post(
  "/request-supervisor",
  isAuthenticated,
  isAuthorized("Student"),
  requestSupervisor
);
router.get(
  "/feedback/:projectId",
  isAuthenticated,
  isAuthorized("Student"),
  getFeedback
);

router.get(
  "/fetch-dashboard-stats",
  isAuthenticated,
  isAuthorized("Student"),
  getDashboardStats
);
router.get(
  "/download/:projectId/:fileId",
  isAuthenticated,
  isAuthorized("Student"),
  downloadFile
);
export default router;