import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, LogOut, ChevronDown, Menu, X } from "lucide-react";
import { logout } from "../../store/slices/authSlice";
import { useTheme } from "../../context/ThemeContext";
import logoImg from "../../assets/logo.png";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { authUser } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()).then(() => navigate("/login"));
  };

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U";

  const roleColor = {
    Admin: "from-purple-500 to-indigo-600",
    Teacher: "from-green-500 to-emerald-600",
    Student: "from-blue-500 to-cyan-600",
  };

  return (
    <nav className="fixed w-full top-0 z-30 transition-colors duration-300"
      style={{
        background: "var(--neu-bg)",
        boxShadow: "0 4px 14px var(--neu-shadow-dark), 0 -2px 6px var(--neu-shadow-light), 0 2px 20px rgba(99,102,241,0.08)"
      }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>

            <div className="flex items-center gap-2.5">
              <img src={logoImg} alt="NextGen EduTrack" className="w-8 h-8 rounded-lg object-contain" />
              <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100 hidden sm:block">
                NextGen EduTrack
              </h1>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Profile */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${roleColor[authUser?.role] || "from-blue-500 to-cyan-600"} flex items-center justify-center shadow-sm`}>
                  <span className="text-xs font-semibold text-white">
                    {getInitials(authUser?.name)}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-tight">
                    {authUser?.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {authUser?.role}
                  </p>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
              </motion.button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#131f35] rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{authUser?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{authUser?.email}</p>
                      <span className={`inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${roleColor[authUser?.role]} text-white`}>
                        {authUser?.role}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
