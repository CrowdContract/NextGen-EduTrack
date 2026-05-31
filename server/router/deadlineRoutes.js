import express from "express";
import { isAuthenticated } from "../middlewares/authmiddleware.js";
import Project from "../models/project.js";
import Deadline from "../models/deadline.js";

const router = express.Router();

// ================= CREATE / UPDATE DEADLINE =================
router.post("/create-deadline/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { dueDate, name } = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      { deadline: dueDate },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      success: true,
      message: "Deadline updated successfully",
      data: { deadline: { _id: id, dueDate, name, project: id } },
    });
  } catch (error) {
    console.error("DEADLINE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET ALL DEADLINES =================
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let projects;
    if (role === "Admin") {
      projects = await Project.find({}).select("title deadline student supervisor").lean();
    } else if (role === "Teacher") {
      projects = await Project.find({ supervisor: userId }).select("title deadline student").lean();
    } else {
      projects = await Project.find({ student: userId }).select("title deadline").lean();
    }

    const deadlines = projects
      .filter((p) => p.deadline)
      .map((p) => ({
        _id: p._id,
        name: p.title,
        dueDate: p.deadline,
        project: p._id,
        projectTitle: p.title,
      }));

    res.status(200).json({
      success: true,
      data: { deadlines },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= DELETE DEADLINE =================
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    await Project.findByIdAndUpdate(id, { $unset: { deadline: "" } });

    res.status(200).json({
      success: true,
      message: "Deadline removed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
