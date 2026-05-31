import express from "express";
import {
  getTeacherDashboardStats,
  acceptRequest,
  getRequests,
  rejectRequest,
  getAssignedStudents,
  getTeacherFiles,
  giveFeedback,
} from "../controllers/teacherController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authmiddleware.js";

const router = express.Router();

router.get("/fetch-dashboard-stats",      isAuthenticated, isAuthorized("Teacher"), getTeacherDashboardStats);
router.get("/requests",                   isAuthenticated, isAuthorized("Teacher"), getRequests);
router.get("/assigned-students",          isAuthenticated, isAuthorized("Teacher"), getAssignedStudents);
router.get("/files",                      isAuthenticated, isAuthorized("Teacher"), getTeacherFiles);
router.put("/requests/:requestId/accept", isAuthenticated, isAuthorized("Teacher"), acceptRequest);
router.put("/requests/:requestId/reject", isAuthenticated, isAuthorized("Teacher"), rejectRequest);
router.post("/feedback/:projectId",       isAuthenticated, isAuthorized("Teacher"), giveFeedback);

export default router;
