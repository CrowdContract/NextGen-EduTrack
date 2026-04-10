import express from "express";
import {
  createStudent,
  updateStudent,
  deleteStudent,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getAllUsers,
  getAllProjects,
  getDashboardStats,
  assignSupervisor
 
} from "../controllers/adminController.js";

import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authmiddleware.js";

const router = express.Router();

// ===== STUDENT =====
router.post("/create-student", isAuthenticated, isAuthorized("Admin"), createStudent);
router.put("/update-student/:id", isAuthenticated, isAuthorized("Admin"), updateStudent);
router.delete("/delete-student/:id", isAuthenticated, isAuthorized("Admin"), deleteStudent);

// ===== TEACHER =====
router.post("/create-teacher", isAuthenticated, isAuthorized("Admin"), createTeacher);
router.put("/update-teacher/:id", isAuthenticated, isAuthorized("Admin"), updateTeacher);
router.delete("/delete-teacher/:id", isAuthenticated, isAuthorized("Admin"), deleteTeacher);

// ===== USERS =====
router.get("/users", isAuthenticated, isAuthorized("Admin"), getAllUsers);
router.post("/assign-supervisor", isAuthenticated, isAuthorized("Admin"), assignSupervisor);

router.get(
  "/projects",
  isAuthenticated,
  isAuthorized("Admin"),
  getAllProjects
);
router.get(
  "/fetch-dashboard-stats",
  isAuthenticated,
  getDashboardStats
);

export default router;