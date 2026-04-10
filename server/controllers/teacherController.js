import * as requestServices from "../services/requestServices.js";
import * as notificationServices from "../services/notificationServices.js";

import Project from "../models/project.js";
import Notification from "../models/notification.js";
import SupervisorRequest from "../models/supervisorRequest.js";
import User from "../models/user.js";

import {
  generateRequestAcceptedTemplate,
  generateRequestRejectedTemplate,
} from "../utils/emailTemplate.js";

import { sendEmail } from "../utils/sendEmail.js"; // ✅ FIXED

import ErrorHandler from "../utils/errorHandler.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

// ================= DASHBOARD =================
export const getTeacherDashboardStats = asyncHandler(async (req, res, next) => {
  const teacherId = req.user._id;

  const totalPendingRequests = await SupervisorRequest.countDocuments({
    supervisor: teacherId,
    status: "pending",
  });

  const completedProjects = await Project.countDocuments({
    supervisor: teacherId,
    status: "completed",
  });

  const recentNotifications = await Notification.find({
    user: teacherId,
  })
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    message: "Dashboard stats fetched for teacher successfully",
    data: {
      totalPendingRequests,
      completedProjects,
      recentNotifications,
    },
  });
});

// ================= GET REQUESTS =================
export const getRequests = asyncHandler(async (req, res, next) => {
  const { supervisor } = req.query;

  const filters = {};
  if (supervisor) filters.supervisor = supervisor;

  const { requests, total } = await requestServices.getAllRequests(filters);

  const updatedRequests = await Promise.all(
    requests.map(async (reqObj) => {
      const requestObj = reqObj.toObject ? reqObj.toObject() : reqObj;

      if (requestObj?.student?._id) {
        const latestProject = await Project.findOne({
          student: requestObj.student._id,
        })
          .sort({ createdAt: -1 })
          .lean();

        return { ...requestObj, latestProject };
      }

      return requestObj;
    })
  );

  res.status(200).json({
    success: true,
    message: "Requests fetched successfully",
    data: {
      requests: updatedRequests,
      total,
    },
  });
});

// ================= ACCEPT REQUEST =================
export const acceptRequest = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;
  const teacherId = req.user._id;

  const request = await requestServices.acceptRequest(requestId, teacherId);

  if (!request) return next(new ErrorHandler("Request not found", 404));

  // 🔔 Notification
  await notificationServices.notifyUser(
    request.student._id,
    `Your supervisor request has been accepted by ${req.user.name}`,
    "approval",
    "/students/status",
    "low"
  );

  // 📧 Email
  const student = await User.findById(request.student._id);
  const studentEmail = student.email;

  const message = generateRequestAcceptedTemplate(req.user.name); // ✅ FIXED

  await sendEmail({
    to: studentEmail,
    subject: "NextGen EduTrack - Your Supervisor Request Has Been Accepted",
    message,
  });

  res.status(200).json({
    success: true,
    message: "Request accepted successfully",
    data: { request },
  });
});

// ================= REJECT REQUEST =================
export const rejectRequest = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;
  const teacherId = req.user._id;

  const request = await requestServices.rejectRequest(requestId, teacherId);

  if (!request) return next(new ErrorHandler("Request not found", 404));

  // 🔔 Notification
  await notificationServices.notifyUser(
    request.student._id,
    `Your supervisor request has been rejected by ${req.user.name}`,
    "rejection",
    "/students/status",
    "high"
  );

  // 📧 Email
  const student = await User.findById(request.student._id);
  const studentEmail = student.email;

  const message = generateRequestRejectedTemplate(req.user.name);

  await sendEmail({
    to: studentEmail,
    subject: "NextGen EduTrack - ❌ Your Supervisor Request Has Been Rejected",
    message,
  });

  res.status(200).json({
    success: true,
    message: "Request rejected",
    data: { request },
  });
});

// ================= GET ASSIGNED STUDENTS =================
export const getAssignedStudents = asyncHandler(async (req, res, next) => {
  const teacherId = req.user._id;

  // Get student IDs from accepted requests (source of truth)
  const acceptedRequests = await SupervisorRequest.find({
    supervisor: teacherId,
    status: "accepted",
  }).select("student");

  const studentIds = acceptedRequests.map((r) => r.student);

  if (studentIds.length === 0) {
    return res.status(200).json({
      success: true,
      message: "Assigned students fetched successfully",
      data: { students: [], total: 0 },
    });
  }

  const students = await User.find({ _id: { $in: studentIds } })
    .select("name email department joinDate")
    .lean();

  // Attach each student's latest project
  const studentsWithProjects = await Promise.all(
    students.map(async (student) => {
      const project = await Project.findOne({ student: student._id })
        .sort({ createdAt: -1 })
        .lean();
      return { ...student, latestProject: project || null };
    })
  );

  // Also sync teacher's assignedStudents array in case it's stale
  await User.findByIdAndUpdate(teacherId, {
    $addToSet: { assignedStudents: { $each: studentIds } },
  });

  res.status(200).json({
    success: true,
    message: "Assigned students fetched successfully",
    data: { students: studentsWithProjects, total: studentsWithProjects.length },
  });
});

// ================= GET TEACHER FILES =================
export const getTeacherFiles = asyncHandler(async (req, res, next) => {
  const teacherId = req.user._id;

  const projects = await Project.find({ supervisor: teacherId })
    .populate("student", "name email")
    .lean();

  // Flatten all files with project + student context
  const files = projects.flatMap((project) =>
    project.files.map((file) => ({
      ...file,
      projectId: project._id,
      projectTitle: project.title,
      student: project.student,
    }))
  );

  res.status(200).json({
    success: true,
    message: "Files fetched successfully",
    data: { files, total: files.length },
  });
});

// ================= GIVE FEEDBACK =================
export const giveFeedback = asyncHandler(async (req, res, next) => {
  const teacherId = req.user._id;
  const { projectId } = req.params;
  const { message, type } = req.body;

  if (!message || !type) {
    return next(new ErrorHandler("Message and type are required", 400));
  }

  const project = await Project.findById(projectId);

  if (!project) return next(new ErrorHandler("Project not found", 404));

  if (!project.supervisor || project.supervisor.toString() !== teacherId.toString()) {
    return next(new ErrorHandler("Not authorized to give feedback on this project", 403));
  }

  project.feedback.push({ supervisorId: teacherId, message, type });
  await project.save();

  // Notify student
  await notificationServices.notifyUser(
    project.student,
    `Your supervisor has given new feedback on your project`,
    "general",
    "/students/feedback",
    "medium"
  );

  res.status(200).json({
    success: true,
    message: "Feedback submitted successfully",
    data: { feedback: project.feedback },
  });
});