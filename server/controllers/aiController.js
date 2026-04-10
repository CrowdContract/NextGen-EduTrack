import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import * as aiService from "../services/aiService.js";
import Project from "../models/project.js";
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// helper — extract text from a PDF file path
const extractPdfText = async (filePath) => {
  try {
    const abs = path.resolve(filePath);
    if (!fs.existsSync(abs)) return null;
    const buffer = fs.readFileSync(abs);
    const data = await pdfParse(buffer);
    return data.text?.trim() || null;
  } catch {
    return null;
  }
};

// ── Summarize project ────────────────────────────────────────────────────────
export const summarizeProject = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId).lean();
  if (!project) return next(new ErrorHandler("Project not found", 404));

  const summary = await aiService.summarizeProject({
    title: project.title,
    description: project.description,
  });

  res.status(200).json({ success: true, data: { summary } });
});

// ── Generate AI feedback suggestion ─────────────────────────────────────────
export const suggestFeedback = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const { type = "general" } = req.body;

  const project = await Project.findById(projectId).lean();
  if (!project) return next(new ErrorHandler("Project not found", 404));

  const feedback = await aiService.generateFeedback({
    title: project.title,
    description: project.description,
    type,
  });

  res.status(200).json({ success: true, data: { feedback } });
});

// ── Code Explainer ───────────────────────────────────────────────────────────
export const explainCode = asyncHandler(async (req, res, next) => {
  const { code, language } = req.body;
  if (!code?.trim()) return next(new ErrorHandler("Code is required", 400));
  const explanation = await aiService.explainCode({ code, language });
  res.status(200).json({ success: true, data: { explanation } });
});

// ── Code Generator ───────────────────────────────────────────────────────────
export const generateCode = asyncHandler(async (req, res, next) => {
  const { prompt, language } = req.body;
  if (!prompt?.trim()) return next(new ErrorHandler("Prompt is required", 400));
  const code = await aiService.generateCode({ prompt, language });
  res.status(200).json({ success: true, data: { code } });
});

// ── AI Grading ───────────────────────────────────────────────────────────────
export const gradeProject = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId).lean();
  if (!project) return next(new ErrorHandler("Project not found", 404));

  // extract PDF text from files
  const fileTexts = [];
  for (const file of project.files || []) {
    if (file.fileType?.includes("pdf") || file.fileUrl?.endsWith(".pdf")) {
      const text = await extractPdfText(file.fileUrl);
      if (text) fileTexts.push({ name: file.originalName, text });
    }
  }

  const raw = await aiService.gradeProject({
    title: project.title,
    description: project.description,
    fileTexts,
  });

  let result;
  try {
    result = JSON.parse(raw);
  } catch {
    // try to extract JSON from response
    const match = raw.match(/\{[\s\S]*\}/);
    result = match ? JSON.parse(match[0]) : { raw };
  }

  res.status(200).json({ success: true, data: { grade: result } });
});

// ── Smart Search ─────────────────────────────────────────────────────────────
export const smartSearch = asyncHandler(async (req, res, next) => {
  const { query } = req.body;
  if (!query?.trim()) return next(new ErrorHandler("Query is required", 400));

  const projects = await Project.find()
    .populate("student", "name")
    .lean();

  const raw = await aiService.smartSearch({ query, projects });

  let ids = [];
  try {
    ids = JSON.parse(raw);
  } catch {
    const match = raw.match(/\[[\s\S]*\]/);
    ids = match ? JSON.parse(match[0]) : [];
  }

  const matched = projects.filter((p) => ids.includes(p._id.toString()));
  res.status(200).json({ success: true, data: { projects: matched, total: matched.length } });
});
export const chat = asyncHandler(async (req, res, next) => {
  const { messages, projectId, selectedFileIds } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return next(new ErrorHandler("Messages are required", 400));
  }

  let projectContext = null;
  let fileTexts = [];

  if (projectId) {
    const project = await Project.findById(projectId).lean();
    if (project) {
      projectContext = { title: project.title, description: project.description };

      // Extract text from selected files (or all if none selected)
      const filesToProcess = selectedFileIds?.length
        ? project.files.filter((f) => selectedFileIds.includes(f._id.toString()))
        : project.files;

      for (const file of filesToProcess) {
        if (file.fileType?.includes("pdf") || file.fileUrl?.endsWith(".pdf")) {
          const text = await extractPdfText(file.fileUrl);
          if (text) fileTexts.push({ name: file.originalName, text });
        }
      }
    }
  }

  const reply = await aiService.chatWithAssistant({ messages, projectContext, fileTexts });

  res.status(200).json({ success: true, data: { reply } });
});
