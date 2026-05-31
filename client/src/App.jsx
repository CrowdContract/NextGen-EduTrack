import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/authSlice";
import { getAllProjects, getAllUsers } from "./store/slices/adminSlice";

// Toast
import { ToastContainer } from "react-toastify";
import { Loader } from "lucide-react";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageTeachers from "./pages/admin/ManageTeachers";
import AssignSupervisor from "./pages/admin/AssignSupervisor";
import DeadlinesPage from "./pages/admin/DeadlinesPage";
import ProjectsPage from "./pages/admin/ProjectsPage";

// Student Pages
import SubmitProposal from "./pages/student/SubmitProposal";
import SupervisorsPage from "./pages/student/SupervisorPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import UploadFiles from "./pages/student/UploadFiles";
import FeedbackPage from "./pages/student/FeedbackPage";
import NotificationsPage from "./pages/student/NotificationsPage";
import AiAssistant from "./pages/student/AiAssistant";
import CodeExplainer from "./pages/student/CodeExplainer";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import PendingRequests from "./pages/teacher/PendingRequests";
import AssignedStudents from "./pages/teacher/AssignedStudents";
import TeacherFiles from "./pages/teacher/TeacherFiles";
import AiGrading from "./pages/teacher/AiGrading";

import QuickTasksFAB from "./components/QuickTasksFAB";

// ✅ ProtectedRoute defined OUTSIDE App to prevent re-creation on every render
const ProtectedRoute = ({ children, allowedRoles, authUser }) => {
  if (!authUser) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(authUser.role)) {
    const redirectPath =
      authUser.role === "Admin" ? "/admin" :
      authUser.role === "Teacher" ? "/teacher" : "/student";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
  const adminDataLoaded = useRef(false);

  // Check auth on load — once
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // Load admin data — only once when admin is confirmed
  useEffect(() => {
    if (authUser?.role === "Admin" && !adminDataLoaded.current) {
      adminDataLoaded.current = true;
      dispatch(getAllUsers());
      dispatch(getAllProjects());
    }
  }, [authUser?._id, authUser?.role, dispatch]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  const roleHome = authUser?.role === "Admin" ? "/admin" :
                   authUser?.role === "Teacher" ? "/teacher" : "/student";

  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT */}
        <Route path="/" element={authUser ? <Navigate to={roleHome} /> : <Navigate to="/login" />} />

        {/* AUTH */}
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={roleHome} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/register" element={!authUser ? <RegisterPage /> : <Navigate to={roleHome} />} />

        {/* ===== ADMIN ===== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]} authUser={authUser}>
              <DashboardLayout userRole="Admin" />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<ManageStudents />} />
          <Route path="teachers" element={<ManageTeachers />} />
          <Route path="assign-supervisor" element={<AssignSupervisor />} />
          <Route path="deadlines" element={<DeadlinesPage />} />
          <Route path="projects" element={<ProjectsPage />} />
        </Route>

        {/* ===== STUDENT ===== */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["Student"]} authUser={authUser}>
              <DashboardLayout userRole="Student" />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="submit-proposal" element={<SubmitProposal />} />
          <Route path="upload-files" element={<UploadFiles />} />
          <Route path="supervisor" element={<SupervisorsPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="ai-assistant" element={<AiAssistant />} />
          <Route path="code-explainer" element={<CodeExplainer />} />
        </Route>

        {/* ===== TEACHER ===== */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["Teacher"]} authUser={authUser}>
              <DashboardLayout userRole="Teacher" />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="pending-requests" element={<PendingRequests />} />
          <Route path="assigned-students" element={<AssignedStudents />} />
          <Route path="files" element={<TeacherFiles />} />
          <Route path="ai-grading" element={<AiGrading />} />
        </Route>

        {/* CATCH ALL */}
        <Route
          path="*"
          element={authUser ? <Navigate to={roleHome} replace /> : <Navigate to="/login" replace />}
        />

      </Routes>

      <ToastContainer theme="dark" />
      {authUser && <QuickTasksFAB />}
    </BrowserRouter>
  );
};

export default App;
