import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import User from "../models/user.js";
import * as projectService from "../services/projectServices.js";
import * as requestService from "../services/requestServices.js";
import { notifyUser } from "../services/notificationServices.js"; 
import Notification from "../models/notification.js";// ✅ FIXED
import { streamDownload } from "../services/fileServices.js";
// ================= GET PROJECT =================
export const getStudentProject = asyncHandler(async (req, res, next) => {
  const studentId = req.user._id;

  const project = await projectService.getProjectByStudent(studentId); // ✅ FIXED

 if (!project) {
  return res.status(200).json({
    success: true,
    data: { project: null },
  });
}

  res.status(200).json({
    success: true,
    data: { project }, // ✅ consistent response
  });
});


import Project from "../models/project.js";

export const submitProposal = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  const studentId = req.user._id;

  if (!title || !description) {
    return next(new ErrorHandler("Title and description required", 400));
  }

  const existingProject = await projectService.getProjectByStudent(studentId);

  if (existingProject && existingProject.status !== "rejected") {
    return next(
      new ErrorHandler(
        "You already have an active project. Submit new only if previous rejected.",
        400
      )
    );
  }

  // ✅ delete rejected project
  await Project.deleteMany({
    student: studentId,
    status: "rejected",
  });

  // ✅ create new project
  const newProject = await Project.create({
    title,
    description,
    student: studentId,
    status: "pending",
  });

  res.status(201).json({
    success: true,
    message: "Project submitted successfully",
    data: newProject,
  });
});



export const uploadFiles = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const studentId = req.user._id;

  console.log("REQ FILES:", req.files);

  const project = await projectService.getProjectById(projectId);

  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

  const projectStudentId = project.student._id
  ? project.student._id.toString()
  : project.student.toString();

const loggedUserId = studentId.toString();

console.log("Project student:", projectStudentId);
console.log("Logged user:", loggedUserId);

if (projectStudentId !== loggedUserId) {
  return next(
    new ErrorHandler("Not authorized to upload files", 403)
  );
}
  if (!req.files || req.files.length === 0) {
    return next(new ErrorHandler("No files uploaded", 400));
  }

  const updatedProject = await projectService.addFilesToProject(
    projectId,
    req.files
  );

  res.status(200).json({
    success: true,
    message: "File uploaded successfully",
    data: { project: updatedProject },
  });
});


// ================= GET ALL SUPERVISORS =================
export const getAvailableSupervisors = asyncHandler(async (req, res) => {
  const supervisors = await User.find({ role: "Teacher" })
    .select("name email department expertise");

  res.status(200).json({
    success: true,
    data: { supervisors },
  });
});


// ================= GET ASSIGNED SUPERVISOR =================
export const getSupervisor = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const student = await User.findById(studentId).populate(
    "supervisor",
    "name email department expertise"
  );

  if (!student.supervisor) {
    return res.status(200).json({
      success: true,
      data: { supervisor: null },
    });
  }

  res.status(200).json({
    success: true,
    data: { supervisor: student.supervisor },
  });
});


// ================= REQUEST SUPERVISOR =================
export const requestSupervisor = asyncHandler(async (req, res, next) => {
  const { teacherId, message, deadline } = req.body;
  const studentId = req.user._id;

  console.log("🔥 REQ BODY:", req.body);

  const student = await User.findById(studentId);

  if (student.supervisor) {
    return next(
      new ErrorHandler("You already have a supervisor assigned.", 400)
    );
  }

  const supervisor = await User.findById(teacherId);

  if (!supervisor) {
    return next(new ErrorHandler("Supervisor not found", 404));
  }

  if (supervisor.role !== "Teacher") {
    return next(new ErrorHandler("Invalid supervisor selected.", 400));
  }

  const assignedCount = supervisor.assignedStudents?.length || 0;

  if (
    supervisor.maxStudents &&
    assignedCount >= supervisor.maxStudents
  ) {
    return next(
      new ErrorHandler("Supervisor has reached maximum capacity.", 400)
    );
  }

  // 🔥 ADD TRY-CATCH HERE
  try {
    const request = await requestService.createRequest({
      student: studentId,
      supervisor: teacherId,
      message,
      deadline,
    });

    console.log("✅ Request Created:", request);

    // 🔥 SAFE NOTIFICATION
    try {
      await notifyUser(
        teacherId,
        `${student?.name || "Student"} has requested ${supervisor?.name || "Supervisor"}`,
        "request",
        "/teacher/requests",
        "medium"
      );
    } catch (err) {
      console.error("🔥 NOTIFICATION ERROR:", err);
    }

    res.status(201).json({
      success: true,
      data: { request },
      message: "Supervisor request sent successfully",
    });

  } catch (error) {
    console.error("🔥 BACKEND ERROR:", error); // 👈 THIS IS WHAT WE NEED
    return next(error);
  }
});
export const getDashboardStats = asyncHandler(async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const project = await Project.findOne({ student: studentId })
      .sort({ createdAt: -1 })
      .populate("supervisor", "name")
      .lean();


    const now = new Date();

    const upcomingDeadlines = await Project.find({
      student: studentId,
      deadline: { $gte: now },
    })
      .select("title description deadline")
      .sort({ deadline: 1 })
      .limit(3)
      .lean();

    const topNotifications = await Notification.find({ user: studentId })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    const feedbackNotifications =
      project?.feedback?.length > 0
        ? project.feedback
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 2)
        : [];

    const supervisorName = project?.supervisor?.name || null;

    res.status(200).json({
      success: true,
      data: {
        project,
        upcomingDeadlines,
        topNotifications,
        feedbackNotifications,
        supervisorName,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
export const getFeedback = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const studentId = req.user._id;

  // ================= GET PROJECT =================
  const project = await projectService.getProjectById(projectId);

  // ================= AUTH CHECK =================
 if (
  !project ||
  (project.student._id || project.student).toString() !==
    studentId.toString()
) {
  return next(
    new ErrorHandler(
      "Not authorized to view feedback for this project",
      403
    )
  );
}
  

  // ================= SORT FEEDBACK =================
  const sortedFeedback = project.feedback.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // ================= RESPONSE =================
  res.status(200).json({
    success: true,
    data: {
      feedback: sortedFeedback,
    },
  });
});

export const downloadFile = async (req, res) => {
  try {
    console.log(" STEP 1");

    const { projectId, fileId } = req.params;
    const studentId = req.user._id;

    console.log("STEP 2");

    const project = await projectService.getProjectById(projectId);

    console.log("STEP 3", project);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    console.log("STEP 4");

    const file = project.files.find(
      (f) => f._id.toString() === fileId
    );

    console.log("STEP 5", file);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    console.log("STEP 6", file.fileUrl);

    res.json({ file });

  } catch (err) {
    console.error("FINAL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};