import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, X, ArrowRight, Clock, BadgeCheck, MessageCircle, AlertCircle } from "lucide-react";
import { getNotifications, markAllAsRead } from "../store/slices/notificationSlice";

const typeIcon = {
  approval: <BadgeCheck size={14} className="text-green-500" />,
  rejection: <AlertCircle size={14} className="text-red-500" />,
  feedback: <MessageCircle size={14} className="text-blue-500" />,
  deadline: <Clock size={14} className="text-orange-500" />,
  request: <Bell size={14} className="text-purple-500" />,
  general: <Bell size={14} className="text-slate-400" />,
};

const roleLinks = {
  Student: [
    { label: "My Project", path: "/student" },
    { label: "Upload Files", path: "/student/upload-files" },
    { label: "AI Assistant", path: "/student/ai-assistant" },
    { label: "Feedback", path: "/student/feedback" },
  ],
  Teacher: [
    { label: "Pending Requests", path: "/teacher/pending-requests" },
    { label: "Assigned Students", path: "/teacher/assigned-students" },
    { label: "AI Grading", path: "/teacher/ai-grading" },
  ],
  Admin: [
    { label: "Dashboard", path: "/admin" },
    { label: "Projects", path: "/admin/projects" },
    { label: "Assign Supervisor", path: "/admin/assign-supervisor" },
  ],
};

const QuickTasksFAB = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef(null);

  const { authUser } = useSelector((s) => s.auth);
  const notifications = useSelector((s) => s.notifications.list || []);
  const unreadCount = useSelector((s) => s.notifications.unreadCount || 0);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const recent = notifications.slice(0, 5);
  const links = roleLinks[authUser?.role] || [];

  const formatTime = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* PANEL */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-80 rounded-2xl overflow-hidden transition-colors duration-300"
            style={{
              background: "var(--neu-bg)",
              boxShadow: "8px 8px 20px var(--neu-shadow-dark), -8px -8px 20px var(--neu-shadow-light), 0 0 30px rgba(99,102,241,0.12)"
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Bell size={15} className="text-purple-500" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => dispatch(markAllAsRead())}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                  >
                    <CheckCheck size={12} /> All read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="max-h-52 overflow-y-auto">
              {recent.length === 0 ? (
                <div className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                  No notifications yet
                </div>
              ) : (
                recent.map((n) => (
                  <div
                    key={n._id}
                    className={`flex gap-3 px-4 py-3 border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${
                      !n.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                    }`}
                    onClick={() => { if (n.link) navigate(n.link); setOpen(false); }}
                  >
                    <div className="mt-0.5 shrink-0">{typeIcon[n.type] || typeIcon.general}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug line-clamp-2">
                        {n.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{formatTime(n.createdAt)}</p>
                    </div>
                    {!n.isRead && (
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Quick Links */}
            <div className="px-4 py-3 border-t border-slate-100 dark:border-white/10">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wide">Quick Navigate</p>
              <div className="grid grid-cols-2 gap-1.5">
                {links.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => { navigate(link.path); setOpen(false); }}
                    className="flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-300 transition-all duration-200"
                    style={{
                      background: "var(--neu-bg)",
                      boxShadow: "3px 3px 7px var(--neu-shadow-dark), -3px -3px 7px var(--neu-shadow-light)"
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "3px 3px 7px var(--neu-shadow-dark), -3px -3px 7px var(--neu-shadow-light), 0 0 10px rgba(99,102,241,0.2)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "3px 3px 7px var(--neu-shadow-dark), -3px -3px 7px var(--neu-shadow-light)"}
                  >
                    {link.label}
                    <ArrowRight size={11} className="text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-white/10">
              <button
                onClick={() => {
                  const path = authUser?.role === "Student" ? "/student/notifications"
                    : authUser?.role === "Teacher" ? "/teacher"
                    : "/admin";
                  navigate(path);
                  setOpen(false);
                }}
                className="w-full text-xs text-center text-purple-600 dark:text-purple-400 hover:underline py-1"
              >
                View all notifications →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB BUTTON */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="relative w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          boxShadow: open
            ? "inset 3px 3px 8px rgba(0,0,0,0.3), 0 0 25px rgba(99,102,241,0.6)"
            : "4px 4px 12px var(--neu-shadow-dark), -4px -4px 12px var(--neu-shadow-light), 0 0 20px rgba(99,102,241,0.4)"
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={open ? "close" : "bell"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X size={22} /> : <Bell size={22} />}
          </motion.div>
        </AnimatePresence>

        {/* Badge */}
        {!open && unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white dark:border-[#0b1120]"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.div>
        )}
      </motion.button>

    </div>
  );
};

export default QuickTasksFAB;
