import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAssignedStudents, giveFeedback } from "../../store/slices/teacherSlice";
import { suggestFeedback, clearSuggestedFeedback } from "../../store/slices/aiSlice";
import { Users, MessageSquarePlus, X, Sparkles } from "lucide-react";

const FeedbackModal = ({ student, project, onClose }) => {
  const dispatch = useDispatch();
  const { suggestedFeedback, loading: aiLoading } = useSelector((s) => s.ai);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("general");
  const [submitting, setSubmitting] = useState(false);

  const handleAISuggest = async () => {
    const result = await dispatch(suggestFeedback({ projectId: project._id, type })).unwrap();
    setMessage(result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      await dispatch(giveFeedback({ projectId: project._id, message, type })).unwrap();
      dispatch(clearSuggestedFeedback());
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 dark:bg-[#131f35]/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Give Feedback</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{student.name} — {project.title}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
            <select className="input-field w-full" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="general">General</option>
              <option value="positive">Positive</option>
              <option value="negative">Needs Revision</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
              <button
                type="button"
                onClick={handleAISuggest}
                disabled={aiLoading}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-60"
              >
                <Sparkles size={11} />
                {aiLoading ? "Generating..." : "AI Suggest"}
              </button>
            </div>
            <textarea
              className="input-field w-full h-32 resize-none"
              placeholder="Write your feedback or use AI Suggest..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              required
            />
            <p className="text-xs text-slate-400 text-right mt-1">{message.length}/1000</p>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !message.trim()}
              className="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AssignedStudents = () => {
  const dispatch = useDispatch();
  const { assignedStudents, loading } = useSelector((state) => state.teacher);
  const [search, setSearch] = useState("");
  const [feedbackTarget, setFeedbackTarget] = useState(null); // { student, project }

  useEffect(() => {
    dispatch(getAssignedStudents());
  }, [dispatch]);

  const filtered = assignedStudents.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Assigned Students</h1>
          <p className="card-subtitle">
            Students currently under your supervision ({assignedStudents.length})
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by name or email..."
        className="input-field w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* LIST */}
      {loading ? (
        <div className="card text-center py-8 text-slate-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-8">
          <Users className="mx-auto mb-2 text-slate-400" size={36} />
          <h3 className="text-lg font-medium text-slate-800 mb-1">No students found</h3>
          <p className="text-slate-500">No assigned students match your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((student) => {
            const project = student.latestProject;
            return (
              <div key={student._id} className="card border border-slate-200">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                  {/* STUDENT INFO */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-0.5">{student.name}</h3>
                    <p className="text-sm text-slate-500">{student.email}</p>
                    {student.department && (
                      <p className="text-sm text-slate-500 mt-0.5">Dept: {student.department}</p>
                    )}
                  </div>

                  {/* PROJECT DETAILS */}
                  <div className="md:min-w-[260px]">
                    {project ? (
                      <div className="bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold text-slate-800 truncate">{project.title}</span>
                          <span className={`badge shrink-0 ${
                            project.status === "approved" ? "badge-approved"
                            : project.status === "rejected" ? "badge-rejected"
                            : project.status === "completed" ? "badge-approved"
                            : "badge-pending"
                          }`}>
                            {project.status?.charAt(0).toUpperCase() + project.status?.slice(1)}
                          </span>
                        </div>
                        {project.description && (
                          <p className="text-xs text-slate-500 mb-2 line-clamp-2">{project.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-400">
                            {project.files?.length || 0} file(s) · {project.feedback?.length || 0} feedback(s)
                          </p>
                          <button
                            onClick={() => setFeedbackTarget({ student, project })}
                            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            <MessageSquarePlus size={13} />
                            Feedback
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic">No project submitted yet</p>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {feedbackTarget && (
        <FeedbackModal
          student={feedbackTarget.student}
          project={feedbackTarget.project}
          onClose={() => setFeedbackTarget(null)}
        />
      )}
    </div>
  );
};

export default AssignedStudents;
