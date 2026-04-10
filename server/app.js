import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import authRouter from "./router/userroutes.js";
import adminRouter from "./router/adminRoutes.js"
import studentRouter from "./router/studentRoutes.js"
import notificationRouter from "./router/notificationRoutes.js"
import projectRouter from "./router/projectRoutes.js"
import deadlineRouter from "./router/deadlineRoutes.js"
import teacherRouter from "./router/teacherRoutes.js"
import aiRouter from "./router/aiRoutes.js"

import {fileURLToPath} from "url"
import path from "path";
import fs from "fs";

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ✅ SIMPLE & CORRECT CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
const uploadsDir = path.join(__dirname, "uploads");
const tempDir = path.join(__dirname, "temp");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Debug (optional)
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

// ✅ Test route (for checking backend)
app.get("/test", (req, res) => {
  res.send("Backend working ✅");
});

// ✅ Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/student",studentRouter);
app.use("/api/v1/notification",notificationRouter);
app.use("/api/v1/project",projectRouter);
app.use("/api/v1/deadline",deadlineRouter);
app.use("/api/v1/teacher",teacherRouter);
app.use("/api/v1/ai", aiRouter);


// ✅ Error handler
app.use(errorMiddleware);

export default app;