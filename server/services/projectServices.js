import Project from "../models/project.js";

// ================= GET PROJECT BY STUDENT =================
export const getProjectByStudent = async (studentId) => {
  return await Project.findOne({ student: studentId })
    .sort({ createdAt: -1 });
};

// ================= CREATE PROJECT =================
export const createProject = async (projectData) => {
  const project = new Project(projectData);
  await project.save();
  return project;
};

// ================= GET PROJECT BY ID =================
export const getProjectById = async (id) => {
  const project = await Project.findById(id)
    .populate("student", "name email")
    .populate("supervisor", "name email");

  if (!project) {
    throw new Error("Project not found"); // ✅ FIXED
  }

  return project;
};

// ================= ADD FILES =================
export const addFilesToProject = async (projectId, files) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found"); // ✅ FIXED
  }

  console.log("FILES RECEIVED:", files);

  const fileMetaData = (files || [])
    .map((file) => {
      if (!file) return null;

      return {
        fileType: file.mimetype || "unknown",
        fileUrl: file.path || file.filename || "no-path",
        originalName: file.originalname || "unknown",
        uploadedAt: new Date(),
      };
    })
    .filter(Boolean);

  project.files.push(...fileMetaData);

  await project.save();

  return project;
};

// ================= GET ALL PROJECTS =================
export const getAllProjects = async () => {
  const projects = await Project.find()
    .populate("student", "name email")
    .populate("supervisor", "name email")
    .sort({ createdAt: -1 });

  const total = await Project.countDocuments();

  return projects;
};