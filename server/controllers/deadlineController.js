import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import Deadline from "../models/deadline.js";
import Project from "../models/project.js";
import {getProjectById} from "../services/projectServices.js"
export const createDeadline = asyncHandler(async (req, res, next) => {
    const {id}=req.params;
  const { name, dueDate } = req.body;
  // 🔹 Validation
  if (!name || !dueDate) {
    return next(new ErrorHandler("Name and due date are required", 400));
  }
   const project=await getProjectById(id);
 if(!project){
    return next(new ErrorHandler("project not found",400));
 }
  // 🔹 Create deadline data
  const deadlineData = {
    name,
    dueDate: new Date(dueDate),
    createdBy: req.user._id,
    project: project || null,
  };

  // 🔹 Save to DB
  const deadline = await Deadline.create(deadlineData);

  // 🔹 Populate fields
  await deadline.populate([
    {
      path: "createdBy",
      select: "name email",
    },
    {
      path: "project",
      select: "title student",
    },
  ]);

  // 🔹 If project exists → update project deadline
  if (project) {
    await Project.findByIdAndUpdate(
      project,
      { deadline: dueDate },
      { new: true, runValidators: true }
    );
  }

  // 🔹 Response
  return res.status(201).json({
    success: true,
    message: "Deadline created successfully",
    data: {
      deadline,
    },
  });
});