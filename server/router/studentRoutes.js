import express from "express";
import {
  getStudentProject,
  submitProposal,
  uploadFiles,
  getSupervisor,
  requestSupervisor,
  revokeSupervisor,
  getAvailableSupervisors,
  getFeedback,
  getDashboardStats,
  downloadFile
} from "../controllers/studentController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authmiddleware.js";
import { handleUploadError, upload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/project",               isAuthenticated, isAuthorized("Student"), getStudentProject);
router.get("/fetch-supervisors",     isAuthenticated, isAuthorized("Student"), getAvailableSupervisors);
router.get("/supervisor",            isAuthenticated, isAuthorized("Student"), getSupervisor);
router.get("/feedback/:projectId",   isAuthenticated, isAuthorized("Student"), getFeedback);
router.get("/fetch-dashboard-stats", isAuthenticated, isAuthorized("Student"), getDashboardStats);
router.get("/download/:projectId/:fileId", isAuthenticated, isAuthorized("Student"), downloadFile);

router.post("/project-proposal",     isAuthenticated, isAuthorized("Student"), submitProposal);
router.post("/upload/:projectId",    isAuthenticated, isAuthorized("Student"), upload.array("files", 10), handleUploadError, uploadFiles);
router.post("/request-supervisor",   isAuthenticated, isAuthorized("Student"), requestSupervisor);
router.delete("/revoke-supervisor",  isAuthenticated, isAuthorized("Student"), revokeSupervisor);

export default router;
