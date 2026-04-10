import express from "express";
import { summarizeProject, suggestFeedback, chat, explainCode, generateCode, gradeProject, smartSearch } from "../controllers/aiController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authmiddleware.js";

const router = express.Router();

router.get("/summarize/:projectId", isAuthenticated, summarizeProject);
router.post("/feedback/:projectId", isAuthenticated, suggestFeedback);
router.post("/chat", isAuthenticated, chat);
router.post("/explain-code", isAuthenticated, explainCode);
router.post("/generate-code", isAuthenticated, generateCode);
router.get("/grade/:projectId", isAuthenticated, gradeProject);
router.post("/smart-search", isAuthenticated, isAuthorized("Admin", "Teacher"), smartSearch);

export default router;
