import express from "express";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authmiddleware.js";

const router = express.Router();

// ================= ROUTES =================

// Get all notifications
router.get("/", isAuthenticated, getNotifications);

// Mark single notification as read
router.put("/:id/read", isAuthenticated, markAsRead);

// Mark all notifications as read
router.put("/read-all", isAuthenticated, markAllAsRead);

// Delete notification
router.delete("/:id/delete", isAuthenticated, deleteNotification);

export default router;