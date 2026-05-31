# ProjectHub — Complete Code Structure & Implementation Guide

## Project Overview

ProjectHub is a full-stack Final Year Project (FYP) Management System with three roles: **Admin**, **Teacher**, and **Student**. Built with React + Redux (frontend) and Node.js + Express + MongoDB (backend).

---

## Repository Structure

```
NextGen-EduTrack/
├── client/                  # React frontend (Vite)
├── server/                  # Node.js + Express backend
├── package.json             # Root scripts (dev, build, install:all)
├── vercel.json              # Vercel deployment config (points to client/)
├── .gitignore
├── README.md
├── SETUP_GUIDE.md
└── CODE.md                  # This file
```

---


### State Management (`src/store/slices/`)

| Slice | Key State | Key Thunks |
|-------|-----------|------------|
| `authSlice.js` | `authUser`, `isCheckingAuth` | `login`, `logout`, `getUser`, `forgotPassword`, `resetPassword` |
| `adminSlice.js` | `users`, `projects`, `stats`, `students`, `teachers` | `getAllUsers`, `getAllProjects`, `getDashboardStats`, `createStudent`, `updateStudent`, `deleteStudent`, `createTeacher`, `updateTeacher`, `deleteTeacher`, `assignSupervisor` |
| `studentSlice.js` | `project`, `supervisor`, `supervisors`, `feedback`, `dashboardStats` | `fetchProject`, `submitProjectProposal`, `getSupervisor`, `fetchAllSupervisors`, `requestSupervisor`, `revokeSupervisor`, `uploadFiles`, `getFeedback`, `fetchDashboardStats`, `downloadFile` |
| `teacherSlice.js` | `assignedStudents`, `files`, `pendingRequests`, `dashboardStats` | `getTeacherDashboardStats`, `getTeacherRequests`, `getAssignedStudents`, `getTeacherFiles`, `giveFeedback`, `acceptRequests`, `rejectRequest` |
| `projectSlice.js` | `projects` | `getAllProjects`, `downloadProjectFile`, `markProjectCompleted` |
| `notificationSlice.js` | `list`, `unreadCount` | `getNotifications`, `markAsRead`, `markAllAsRead`, `deleteNotification` |
| `deadlineSlice.js` | `deadlines` | `createDeadline`, `getDeadlines`, `deleteDeadline` |
| `requestSlice.js` | `list` | `getAllRequests` |
| `aiSlice.js` | `response`, `loading` | `chatWithAI`, `explainCode`, `suggestFeedback`, `gradeProject` |
| `popupSlice.js` | `isCreateStudentModalOpen`, `isCreateTeacherModalOpen` | `toggleStudentModal`, `toggleTeacherModal` |

### Styling (`src/index.css`)
- TailwindCSS utility classes
- Custom classes: `.card`, `.card-header`, `.card-title`, `.card-subtitle`
- `.btn-primary` — blue gradient
- `.btn-secondary` — grey (neutral, for Cancel buttons)
- `.btn-danger` — red gradient
- `.btn-outline` — bordered
- `.badge`, `.badge-approved`, `.badge-rejected`, `.badge-pending`
- `.input-field` — styled input
- Dark mode via CSS variables (`--neu-bg`, `--neu-shadow-dark`, `--neu-shadow-light`)

---

## Backend (`server/`)


### Routes (`server/router/`)

| File | Base Path | Endpoints |
|------|-----------|-----------|
| `userroutes.js` | `/api/v1/auth` | POST `/register`, POST `/login`, GET `/logout`, GET `/me`, POST `/password/forgot-password`, PUT `/password/reset/:token` |
| `adminRoutes.js` | `/api/v1/admin` | CRUD students/teachers, assign supervisor, dashboard stats, get all users/projects |
| `studentRoutes.js` | `/api/v1/student` | GET/POST project, upload files, supervisor CRUD, feedback, dashboard stats, download, **DELETE `/revoke-supervisor`** |
| `teacherRoutes.js` | `/api/v1/teacher` | Dashboard stats, GET/PUT requests (accept/reject), assigned students, files, feedback |
| `projectRoutes.js` | `/api/v1/project` | GET all (admin), **PUT `/:projectId/complete`** (teacher), GET `/:projectId/files/:fileId/download` |
| `deadlineRoutes.js` | `/api/v1/deadline` | POST `/create-deadline/:id`, GET `/`, DELETE `/:id` |
| `notificationRoutes.js` | `/api/v1/notification` | GET `/`, PUT `/:id/read`, PUT `/read-all`, DELETE `/:id/delete` |
| `aiRoutes.js` | `/api/v1/ai` | AI chat, code explain, feedback suggest, grading |

### Controllers (`server/controllers/`)

### Models (`server/models/`)

#### `user.js`
```
name, email, password (hashed), role (Student/Teacher/Admin),
department, expertise[], joinDate, maxStudents,
assignedStudents[], supervisor (ref User), project (ref Project),
resetPasswordToken, resetPasswordExpire
```

#### `project.js`
```
student (ref User), supervisor (ref User),
title, description,
status (pending/approved/rejected/completed),
files[{ fileType, fileUrl, originalName, uploadedAt }],
feedback[{ supervisorId, type, message, createdAt }],
deadline
```
> `feedback.createdAt` added manually (subdocuments don't inherit parent timestamps)

#### `supervisorRequest.js`
```
student (ref User), supervisor (ref User),
message, dueDate, status (pending/accepted/rejected)
```

#### `notification.js`
```
user (ref User), message, type, link, priority, isRead
```

#### `deadline.js`
```
name, dueDate, createdBy (ref User), project (ref Project)
```

### Services (`server/services/`)

| File | Key Functions |
|------|--------------|
| `userServices.js` | `getAllUsers`, `getUserById`, `createUser`, `updateUser`, `deleteUser`, `assignSupervisorDirectly` |
| `projectServices.js` | `getProjectByStudent`, `getProjectById`, `createProject`, `addFilesToProject`, `getAllProjects` (populates student + supervisor) |
| `requestServices.js` | `createRequest`, `getAllRequests`, `acceptRequest` (**sets project status to "approved" + assigns supervisor**), `rejectRequest` |
| `notificationServices.js` | `createNotification`, `notifyUser`, `markAsRead`, `markAllAsRead`, `deleteNotification` |
| `fileServices.js` | `streamDownload` — resolves absolute path, uses `res.download()` |
| `emailServices.js` | `sendEmail` — uses SMTP_HOST/USER/PASSWORD env vars |
| `aiService.js` | Groq SDK integration for all AI features |

### Middlewares (`server/middlewares/`)

| File | Purpose |
|------|---------|
| `authmiddleware.js` | `isAuthenticated` — verifies JWT cookie, `isAuthorized(...roles)` — role check |
| `asyncHandler.js` | Wraps async controllers to catch errors |
| `error.js` | `ErrorHandler` class + `errorMiddleware` for consistent error responses |
| `upload.js` | Multer config for file uploads, `handleUploadError` |

---

## Key Features Implemented


### Supervisor Request Flow
1. Student submits project proposal
2. Student goes to Supervisor page → requests a teacher
3. Teacher sees request in Pending Requests → Accept/Reject
4. On Accept: project status → `approved`, supervisor assigned to student + project
5. Student dashboard shows "Approved" status
6. Student can Revoke supervisor (deletes project + request + clears all links)

### Project Lifecycle
```
pending → approved (on supervisor accept) → completed (teacher marks complete)
       → rejected (admin/teacher rejects)
```
After `completed` or `rejected`, student can submit a new proposal.

### File Management
- Student uploads files to their project
- Teacher can view + download all files from supervised students
- Admin can download any file from the dashboard

### AI Features
- **Student**: Chat assistant, code explainer
- **Teacher**: AI feedback suggestion (in feedback modal), AI grading
- Powered by Groq SDK

### Notifications
- Created on: supervisor request, accept/reject, feedback, project completion
- Admin sees request-type notifications only
- Mark single / mark all as read
- Delete individual notifications
- QuickTasksFAB shows unread count badge

### Deadlines
- Admin sets deadlines per project from Deadlines page
- Stored on the `Project` model as `deadline` field
- Student dashboard shows upcoming deadlines

---

## Environment Variables (`server/.env`)

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/nextgen_edutrack
COOKIE_EXPIRE=7
JWT_SECRET=your_secret
JWT_EXPIRE=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_SERVICE=gmail
GROQ_TOKEN=your_groq_token
```

---

## Running Locally

```bash
# Install all dependencies
npm run install:all

# Start both servers
npm run dev:all

# Or separately:
npm run server   # backend on :4000
npm run client   # frontend on :5173
```

---

## Deployment

- **Frontend**: Vercel — `vercel.json` at root sets `buildCommand: cd client && npm install && npm run build`
- **Backend**: Render — set Root Directory to `server`, Start Command: `node server.js`
- **Database**: MongoDB Atlas (cloud) — replace `MONGO_URI` with Atlas connection string


---

## AI Features — Complete Documentation

### Model Used
- **Provider**: Groq
- **Model**: `llama-3.3-70b-versatile`
- **Config**: temperature `0.7`, max_tokens `1024`
- **SDK**: `groq-sdk` npm package
- **Token**: `GROQ_TOKEN` in `.env`

---

### Backend AI Layer

#### `server/services/aiService.js`
Core AI service — all functions call the internal `chat()` helper which wraps Groq's `chat.completions.create`.

| Function | Input | What it does |
|----------|-------|-------------|
| `summarizeProject({ title, description })` | Project data | Returns 3-4 bullet point summary covering objective, approach, expected outcome |
| `generateFeedback({ title, description, type })` | Project + type (positive/negative/general) | Returns structured feedback with Strengths, Weaknesses, Suggestions sections |
| `generateCode({ prompt, language })` | Description + language | Returns explanation + code block + usage example |
| `explainCode({ code, language })` | Code snippet + language | Returns: what it does, time complexity, space complexity, potential issues, improvements |
| `gradeProject({ title, description, fileTexts })` | Project + extracted PDF text | Returns **JSON object** with score (0-100), grade (A-F), completeness, clarity, originality, technical_depth, strengths[], weaknesses[], remarks |
| `smartSearch({ query, projects })` | Natural language query + project list | Returns **JSON array** of matching project IDs ordered by relevance |
| `chatWithAssistant({ messages, projectContext, fileTexts })` | Chat history + optional project context + file text | Context-aware chat — if project/files provided, AI answers based on them |

#### `server/controllers/aiController.js`
Handles HTTP requests, fetches project from DB, extracts PDF text, calls aiService.

| Controller | Route | What it does |
|-----------|-------|-------------|
| `summarizeProject` | GET `/ai/summarize/:projectId` | Fetches project, calls `aiService.summarizeProject` |
| `suggestFeedback` | POST `/ai/feedback/:projectId` | Fetches project, calls `aiService.generateFeedback` with type from body |
| `explainCode` | POST `/ai/explain-code` | Takes `code` + `language` from body |
| `generateCode` | POST `/ai/generate-code` | Takes `prompt` + `language` from body |
| `gradeProject` | GET `/ai/grade/:projectId` | Fetches project, **extracts text from PDF files using `pdf-parse`**, calls `aiService.gradeProject`. Parses JSON response with fallback regex extraction |
| `smartSearch` | POST `/ai/smart-search` | Fetches all projects, calls `aiService.smartSearch`, filters and returns matched projects |
| `chat` | POST `/ai/chat` | Takes `messages[]`, optional `projectId`, optional `selectedFileIds[]`. Extracts PDF text from selected files, calls `aiService.chatWithAssistant` |

**PDF Text Extraction** (used in grading and chat):
```js
const extractPdfText = async (filePath) => {
  const abs = path.resolve(filePath);
  const buffer = fs.readFileSync(abs);
  const data = await pdfParse(buffer);
  return data.text?.trim() || null;
};
```

#### `server/router/aiRoutes.js`
All routes require `isAuthenticated`. Smart search also requires `isAuthorized("Admin", "Teacher")`.

```
GET  /api/v1/ai/summarize/:projectId    → summarizeProject
POST /api/v1/ai/feedback/:projectId     → suggestFeedback
POST /api/v1/ai/chat                    → chat
POST /api/v1/ai/explain-code            → explainCode
POST /api/v1/ai/generate-code           → generateCode
GET  /api/v1/ai/grade/:projectId        → gradeProject
POST /api/v1/ai/smart-search            → smartSearch (Admin/Teacher only)
```

---

### Frontend AI Layer

#### `client/src/store/slices/aiSlice.js`
Redux slice managing all AI state.

**State:**
```js
{
  summary: null,           // project summary text
  suggestedFeedback: null, // AI-generated feedback text
  codeExplanation: null,   // code explanation text
  generatedCode: null,     // generated code text
  grade: null,             // grading JSON object
  searchResults: null,     // smart search results array
  chatMessages: [],        // [{role, content}] chat history
  loading: false,          // general AI loading
  chatLoading: false,      // chat-specific loading
}
```

**Thunks:**
| Thunk | Calls | Returns |
|-------|-------|---------|
| `summarizeProject(projectId)` | GET `/ai/summarize/:id` | Summary string |
| `suggestFeedback({ projectId, type })` | POST `/ai/feedback/:id` | Feedback string |
| `sendChatMessage({ messages, projectId, selectedFileIds })` | POST `/ai/chat` | Reply string, auto-appended to `chatMessages` |
| `explainCode({ code, language })` | POST `/ai/explain-code` | Explanation string |
| `generateCode({ prompt, language })` | POST `/ai/generate-code` | Code string |
| `gradeProject(projectId)` | GET `/ai/grade/:id` | Grade object `{score, grade, completeness, clarity, originality, technical_depth, strengths[], weaknesses[], remarks}` |
| `smartSearch(query)` | POST `/ai/smart-search` | Projects array |

**Actions (reducers):**
`addUserMessage`, `clearChat`, `clearSummary`, `clearSuggestedFeedback`, `clearCodeExplanation`, `clearGeneratedCode`, `clearGrade`, `clearSearchResults`

---

#### `client/src/pages/student/AiAssistant.jsx`
**Student feature** — context-aware project chat assistant.

**Key features:**
- Loads student's project and files on mount
- **File selector panel** — student can toggle which uploaded files the AI reads (all selected by default)
- **Quick action buttons**: "Summarize Project", "Key Challenges", "Suggest Improvements"
- **AI Summary panel** — shows project summary when requested
- **Chat interface** — animated message bubbles, typing indicator (bouncing dots), auto-scroll to bottom
- Clear chat button
- Sends `projectId` + `selectedFileIds` with every message so AI has full context
- Empty state shows file count and guidance text

**State used:** `ai.chatMessages`, `ai.chatLoading`, `ai.summary`, `ai.loading`, `student.project`

---

#### `client/src/pages/student/CodeExplainer.jsx`
**Student feature** — two-tab code tool.

**Tab 1: Explain Code**
- Paste code + select language
- Click "Explain Code" → AI returns: what it does, time/space complexity, potential issues, improvements
- Copy button on output

**Tab 2: Generate Code**
- Describe what you need in plain English + select language
- Click "Generate Code" → AI returns explanation + code block + usage example
- Copy button on output

**OutputPanel component** — reusable panel with skeleton loading, copy button, clear button, empty state with icon.

**State used:** `ai.codeExplanation`, `ai.generatedCode`, `ai.loading`

---

#### `client/src/pages/teacher/AiGrading.jsx`
**Teacher feature** — AI-powered project grading.

**Key features:**
- Lists all assigned students with their projects
- Click "Grade" on any student → AI analyzes project title, description, and **reads uploaded PDF files**
- **ScoreRing component** — animated SVG circle showing score 0-100 with color coding (green/yellow/red) and letter grade
- **MetricBar component** — animated progress bars for each metric
- Shows: score, grade, completeness, clarity, originality, technical depth, strengths list, weaknesses list, remarks
- Clear button to reset and grade another student

**State used:** `ai.grade`, `ai.loading`, `teacher.assignedStudents`

---

#### AI Feedback in `AssignedStudents.jsx` (Teacher)
The **Feedback modal** has an "AI Suggest" button that:
1. Dispatches `suggestFeedback({ projectId, type })` where type is the selected feedback type (general/positive/negative)
2. Auto-fills the feedback textarea with the AI suggestion
3. Teacher can edit before submitting

**State used:** `ai.suggestedFeedback`, `ai.loading`

---

### AI Data Flow Summary

```
Student Chat:
  AiAssistant.jsx
    → sendChatMessage({ messages, projectId, selectedFileIds })
    → POST /api/v1/ai/chat
    → aiController.chat()
      → extractPdfText() for each selected file
      → aiService.chatWithAssistant({ messages, projectContext, fileTexts })
      → Groq LLaMA 3.3 70B
    → reply appended to chatMessages in Redux

Teacher Grading:
  AiGrading.jsx
    → gradeProject(projectId)
    → GET /api/v1/ai/grade/:projectId
    → aiController.gradeProject()
      → extractPdfText() for all PDF files
      → aiService.gradeProject({ title, description, fileTexts })
      → Groq LLaMA 3.3 70B → JSON response
      → JSON.parse() with regex fallback
    → grade object stored in Redux

Teacher Feedback Suggestion:
  AssignedStudents.jsx (FeedbackModal)
    → suggestFeedback({ projectId, type })
    → POST /api/v1/ai/feedback/:projectId
    → aiController.suggestFeedback()
      → aiService.generateFeedback({ title, description, type })
      → Groq LLaMA 3.3 70B
    → feedback text auto-fills textarea
```
