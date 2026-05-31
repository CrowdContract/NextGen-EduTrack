import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Eye, EyeOff, Sparkles } from "lucide-react";
import { login, guestLogin } from "../../store/slices/authSlice";

const GUEST_ROLES = [
  {
    role: "Admin",
    label: "Guest Admin",
    desc: "Manage students, teachers & projects",
    color: "from-purple-500 to-indigo-600",
    glow: "rgba(139,92,246,0.35)",
  },
  {
    role: "Teacher",
    label: "Guest Teacher",
    desc: "Review requests & grade projects",
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.35)",
  },
  {
    role: "Student",
    label: "Guest Student",
    desc: "Submit proposals & use AI tools",
    color: "from-blue-500 to-cyan-600",
    glow: "rgba(59,130,246,0.35)",
  },
];

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggingIn, authUser } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "", role: "Student" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [guestLoadingRole, setGuestLoadingRole] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) e.email = "Invalid email";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 8) e.password = "Minimum 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(login(formData));
  };

  const handleGuest = async (role) => {
    setGuestLoadingRole(role);
    await dispatch(guestLogin(role));
    setGuestLoadingRole(null);
  };

  useEffect(() => {
    if (authUser) {
      const paths = { Admin: "/admin", Teacher: "/teacher", Student: "/student" };
      navigate(paths[authUser.role] || "/");
    }
  }, [authUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8edf5] dark:bg-[#0b1120] px-4 py-10">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ===== LEFT — LOGIN FORM ===== */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl p-8"
          style={{
            background: "var(--neu-bg)",
            boxShadow: "8px 8px 20px var(--neu-shadow-dark), -8px -8px 20px var(--neu-shadow-light)",
          }}
        >
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
                <BookOpen className="text-white w-6 h-6" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">NextGen EduTrack</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="input-field">
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Forgot */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                Forgot your password?
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoggingIn}
              className="btn-primary w-full"
            >
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </motion.button>

          </form>

          {/* Register link */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Create account
            </Link>
          </p>
        </motion.div>

        {/* ===== RIGHT — GUEST ACCESS ===== */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col justify-center space-y-4"
        >
          <div className="text-center mb-2">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles size={16} className="text-indigo-500" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Try as Guest</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explore the full app without creating an account
            </p>
          </div>

          {GUEST_ROLES.map(({ role, label, desc, color, glow }) => (
            <motion.button
              key={role}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGuest(role)}
              disabled={!!guestLoadingRole}
              className="w-full rounded-2xl p-4 text-left transition-all duration-200 disabled:opacity-60"
              style={{
                background: "var(--neu-bg)",
                boxShadow: `6px 6px 14px var(--neu-shadow-dark), -6px -6px 14px var(--neu-shadow-light)`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = `6px 6px 14px var(--neu-shadow-dark), -6px -6px 14px var(--neu-shadow-light), 0 0 20px ${glow}`}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = `6px 6px 14px var(--neu-shadow-dark), -6px -6px 14px var(--neu-shadow-light)`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-md`}>
                  <span className="text-white text-sm font-bold">{role[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                    {guestLoadingRole === role ? "Logging in..." : label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{desc}</p>
                </div>
                {guestLoadingRole === role && (
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin shrink-0" />
                )}
              </div>
            </motion.button>
          ))}

          <p className="text-center text-xs text-slate-400 dark:text-slate-500 pt-2">
            Guest accounts have full read/write access for demo purposes
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default LoginPage;
