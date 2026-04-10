import express from "express";
import Project from "../models/project.js"; // ✅ ADD THIS

const router = express.Router();

router.post("/create-deadline/:id", async (req, res) => {
  try {
    console.log("🔥 HIT ROUTE");

    const { id } = req.params;
    const { dueDate } = req.body;

    console.log("ID:", id);
    console.log("BODY:", req.body);

    const project = await Project.findByIdAndUpdate(
      id,
      { deadline: dueDate },
      { new: true }
    );

    console.log("PROJECT:", project);

    res.status(200).json({
      message: "Deadline updated successfully",
      data: project,
    });

  } catch (error) {
    console.error("🔥 ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;