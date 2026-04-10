import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Clock, Users, Folder, FileText, Upload,
  User, MessageSquare, Bell, Link, Calendar, GraduationCap, Sparkles, Code2, Star,
} from "lucide-react";
import logoImg from "../../assets/sidebar.png";

const navItems = {
  Student: [
    { name: "Home", path: "/student", icon: Home },
    { name: "Submit Proposal", path: "/student/submit-proposal", icon: FileText },
    { name: "Upload Files", path: "/student/upload-files", icon: Upload },
    { name: "Supervisor", path: "/student/supervisor", icon: User },
    { name: "Feedback", path: "/student/feedback", icon: MessageSquare },
    { name: "Notifications", path: "/student/notifications", icon: Bell },
    { name: "AI Assistant", path: "/student/ai-assistant", icon: Sparkles },
    { name: "Code Tools", path: "/student/code-explainer", icon: Code2 },
  ],
  Teacher: [
    { name: "Home", path: "/teacher", icon: Home },
    { name: "Pending Requests", path: "/teacher/pending-requests", icon: Clock },
    { name: "Assigned Students", path: "/teacher/assigned-students", icon: Users },
    { name: "Files", path: "/teacher/files", icon: Folder },
    { name: "AI Grading", path: "/teacher/ai-grading", icon: Star },
  ],
  Admin: [
    { name: "Home", path: "/admin", icon: Home },
    { name: "Students", path: "/admin/students", icon: Users },
    { name: "Teachers", path: "/admin/teachers", icon: GraduationCap },
    { name: "Assign Supervisor", path: "/admin/assign-supervisor", icon: Link },
    { name: "Deadlines", path: "/admin/deadlines", icon: Calendar },
    { name: "Projects", path: "/admin/projects", icon: Folder },
  ],
};

const roleAccent = {
  Admin:   { bg: "bg-purple-500", glow: "rgba(168,85,247,0.5)" },
  Teacher: { bg: "bg-emerald-500", glow: "rgba(34,197,94,0.5)" },
  Student: { bg: "bg-blue-500",   glow: "rgba(99,102,241,0.5)" },
};

const Sidebar = ({ open, setOpen, userRole }) => {
  const location = useLocation();
  const items = navItems[userRole] || [];
  const accent = roleAccent[userRole] || roleAccent.Student;

  const sidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-200 dark:border-white/10">
        <img
          src={logoImg}
          alt="NextGen EduTrack"
          className="w-9 h-9 rounded-xl object-contain shrink-0 bg-white p-1"
          style={{ boxShadow: `0 0 12px ${accent.glow}` }}
        />
        <AnimatePresence>
          {(open || isMobile) && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
            >
              <p className="font-bold text-sm text-slate-800 dark:text-white leading-tight">NextGen EduTrack</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{userRole}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setOpen(false)}
              className="block"
            >
              <div
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {/* Active left bar */}
                {isActive && (
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 ${accent.bg} rounded-r-full`} />
                )}

                <Icon size={18} className="shrink-0 relative z-10" />

                <AnimatePresence>
                  {(open || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.12 }}
                      className="text-sm font-medium whitespace-nowrap relative z-10"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip when collapsed */}
                {!open && !isMobile && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50 shadow-lg">
                    {item.name}
                  </div>
                )}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {(open || isMobile) && (
        <div className="px-4 py-3 border-t border-slate-200 dark:border-white/10">
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center">NextGen EduTrack v1.0</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.div
        animate={{ width: open ? 220 : 64 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-30 hidden lg:flex flex-col overflow-hidden bg-white dark:bg-[#0d1117] border-r border-slate-200 dark:border-white/5"
      >
        {sidebarContent(false)}
      </motion.div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <motion.div
        initial={false}
        animate={{ x: open ? 0 : -260 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="fixed inset-y-0 left-0 w-[220px] z-50 lg:hidden flex flex-col pt-16 bg-white dark:bg-[#0d1117] border-r border-slate-200 dark:border-white/5"
      >
        {sidebarContent(true)}
      </motion.div>
    </>
  );
};

export default Sidebar;
