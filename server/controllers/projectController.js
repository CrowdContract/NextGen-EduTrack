import * as projectServices from "../services/projectServices.js";
import * as fileServices from "../services/fileServices.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import Project from "../models/project.js";
import { notifyUser } from "../services/notificationServices.js";

// 🔹 GET ALL PROJECTS
export const getAllProjects = asyncHandler(async (req, res, next) => {
  const projects = await projectServices.getAllProjects();
  return res.status(200).json({ success: true, data: { projects } });
});

// 🔹 MARK PROJECT AS COMPLETED
export const markProjectCompleted = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const teacherId = req.user._id;

  const project = await Project.findById(projectId);

  if (!project) return next(new ErrorHandler("Project not found", 404));

  // Allow if teacher is the supervisor OR if project has no supervisor set yet
  if (project.supervisor && project.supervisor.toString() !== teacherId.toString()) {
    return next(new ErrorHandler("Not authorized to update this project", 403));
  }

  // If no supervisor set, assign this teacher as supervisor
  if (!project.supervisor) {
    project.supervisor = teacherId;
  }

  project.status = "completed";
  await project.save();

  // Notify student (wrap in try-catch so it doesn't block the response)
  try {
    await notifyUser(
      project.student,
      "Congratulations! Your project has been marked as completed by your supervisor.",
      "approval",
      "/student",
      "low"
    );
  } catch (err) {
    console.error("Notification error:", err.message);
  }

  res.status(200).json({
    success: true,
    message: "Project marked as completed",
    data: { project },
  });
});


// 🔹 DOWNLOAD FILE
export const downloadFile = asyncHandler(async (req, res, next) => {
  const { projectId, fileId } = req.params;
  const user = req.user;

  const project = await projectServices.getProjectById(projectId);

  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

  const userRole = user.role.toLowerCase();
  const userId = user._id?.toString() || user.id;

  // 🔐 Access check
  const hasAccess =
    userRole === "admin" ||
    project.student._id.toString() === userId ||
    (project.supervisor &&
      project.supervisor._id.toString() === userId);

  if (!hasAccess) {
    return next(
      new ErrorHandler(
        "Not authorized to download files from this project",
        403
      )
    );
  }

  console.log(projectId, fileId);

  const file = project.files.id(fileId);

  if (!file) {
    return next(new ErrorHandler("File not found", 404));
  }

  // 🔽 Download file
  fileServices.streamDownload(
    file.fileUrl,
    res,
    file.originalName
  );
});