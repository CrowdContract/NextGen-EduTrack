import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles, RefreshCw, TrendingUp } from "lucide-react";
import { gradeProject, clearGrade } from "../../store/slices/aiSlice";
import { getAssignedStudents } from "../../store/slices/teacherSlice";

const ScoreRing = ({ score }) => {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-700" />
          <circle
            cx="50" cy="50" r="40" fill="none" strokeWidth="8"
            stroke={color}
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{score}</span>
          <span className="text-xs text-slate-500">/100</span>
        </div>
      </div>
      <span className="text-lg font-bold" style={{ color }}>{grade}</span>
    </div>
  );
};

const MetricBar = ({ label, value }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
      <span>{label}</span>
      <span className="font-medium">{value}/10</span>
    </div>
    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value * 10}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
      />
    </div>
  </div>
);

const AiGrading = () => {
  const dispatch = useDispatch();
  const { assignedStudents, loading: teacherLoading } = useSelector((s) => s.teacher);
  const { grade, loading } = useSelector((s) => s.ai);

  useEffect(() => {
    dispatch(getAssignedStudents());
  }, [dispatch]);

  const handleGrade = (projectId) => {
    dispatch(clearGrade());
    dispatch(gradeProject(projectId));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white shadow-lg"
      >
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <Star size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Grading Assistant</h1>
            <p className="text-amber-100 text-sm mt-0.5">
              Auto-grade student projects based on completeness, clarity & originality
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* STUDENT LIST */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-1">Select a student to grade</h2>
          {teacherLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card space-y-2">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-3 w-48" />
              </div>
            ))
          ) : assignedStudents.length === 0 ? (
            <div className="card text-center py-6 text-slate-400 dark:text-slate-500 text-sm">
              No assigned students yet
            </div>
          ) : (
            assignedStudents.map((student) => {
              const project = student.latestProject;
              if (!project) return null;
              return (
                <motion.div
                  key={student._id}
                  whileHover={{ y: -2 }}
                  className="card flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{student.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{project.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{project.files?.length || 0} file(s)</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleGrade(project._id)}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl disabled:opacity-60 transition-all shrink-0"
                  >
                    <Sparkles size={12} />
                    {loading ? "Grading..." : "Grade"}
                  </motion.button>
                </motion.div>
              );
            })
          )}
        </div>

        {/* GRADE RESULT */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card flex flex-col items-center justify-center gap-4 min-h-64"
            >
              <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
              <p className="text-sm text-slate-500 dark:text-slate-400">AI is evaluating the project...</p>
            </motion.div>
          ) : grade ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Grade Report</h3>
                <button
                  onClick={() => dispatch(clearGrade())}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Clear
                </button>
              </div>

              <div className="flex items-center gap-6">
                <ScoreRing score={grade.score || 0} />
                <div className="flex-1 space-y-2.5">
                  <MetricBar label="Completeness" value={grade.completeness || 0} />
                  <MetricBar label="Clarity" value={grade.clarity || 0} />
                  <MetricBar label="Originality" value={grade.originality || 0} />
                  <MetricBar label="Technical Depth" value={grade.technical_depth || 0} />
                </div>
              </div>

              {grade.strengths?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1.5 flex items-center gap-1">
                    <TrendingUp size={12} /> Strengths
                  </p>
                  <ul className="space-y-1">
                    {grade.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex gap-2">
                        <span className="text-green-500 shrink-0">✓</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {grade.weaknesses?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-red-500 dark:text-red-400 mb-1.5">Weaknesses</p>
                  <ul className="space-y-1">
                    {grade.weaknesses.map((w, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex gap-2">
                        <span className="text-red-400 shrink-0">✗</span>{w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {grade.remarks && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
                  <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{grade.remarks}</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card flex flex-col items-center justify-center gap-3 min-h-64 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Star size={26} className="text-white" />
              </div>
              <p className="text-slate-400 dark:text-slate-500 text-sm">
                Select a student and click Grade to get an AI evaluation
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default AiGrading;
