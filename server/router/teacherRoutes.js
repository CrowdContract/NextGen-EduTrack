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

import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authmiddleware.js";

const router = express.Router();

// 🔹 Dashboard Stats
router.get(
  "/fetch-dashboard-stats",
  isAuthenticated,
  isAuthorized("Teacher"),
  getTeacherDashboardStats
);

// 🔹 Get All Requests
router.get(
  "/requests",
  isAuthenticated,
  isAuthorized("Teacher"),
  getRequests
);

// 🔹 Accept Request
router.put(
  "/requests/:requestId/accept",
  isAuthenticated,
  isAuthorized("Teacher"),
  acceptRequest
);

// 🔹 Reject Request
router.put(
  "/requests/:requestId/reject",
  isAuthenticated,
  isAuthorized("Teacher"),
  rejectRequest
);

// 🔹 Assigned Students
router.get(
  "/assigned-students",
  isAuthenticated,
  isAuthorized("Teacher"),
  getAssignedStudents
);

// 🔹 Teacher Files
router.get(
  "/files",
  isAuthenticated,
  isAuthorized("Teacher"),
  getTeacherFiles
);

// 🔹 Give Feedback
router.post(
  "/feedback/:projectId",
  isAuthenticated,
  isAuthorized("Teacher"),
  giveFeedback
);

export default router;