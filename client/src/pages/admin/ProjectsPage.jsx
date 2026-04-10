import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Folder, Search, FileText, User, GraduationCap, Download } from "lucide-react";
import { downloadProjectFile } from "../../store/slices/projectSlice";

const statusStyle = {
  pending:   "badge-pending",
  approved:  "badge-approved",
  rejected:  "badge-rejected",
  completed: "badge-completed",
};

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((s) => s.admin);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [downloadingId, setDownloadingId] = useState(null);

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.supervisor?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDownload = async (projectId, fileId) => {
    setDownloadingId(fileId);
    try {
      await dispatch(downloadProjectFile({ projectId, fileId })).unwrap();
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-6 text-white shadow-lg"
      >
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <Folder size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Projects</h1>
            <p className="text-indigo-200 text-sm mt-0.5">
              {projects.length} total project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </motion.div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, student, or supervisor..."
            className="input-field pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-field sm:w-44"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card space-y-3">
              <div className="skeleton h-5 w-48" />
              <div className="skeleton h-4 w-64" />
              <div className="skeleton h-4 w-32" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-10">
          <Folder size={36} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
          <p className="text-slate-500 dark:text-slate-400">No projects found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                {/* LEFT */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {project.title}
                    </h3>
                    <span className={`badge ${statusStyle[project.status] || "badge-pending"}`}>
                      {project.status?.charAt(0).toUpperCase() + project.status?.slice(1)}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {project.student?.name || "No student"}
                    </span>
                    <span className="flex items-center gap-1">
                      <GraduationCap size={12} />
                      {project.supervisor?.name || "No supervisor"}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={12} />
                      {project.files?.length || 0} file(s)
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={12} />
                      {project.feedback?.length || 0} feedback(s)
                    </span>
                  </div>
                </div>

                {/* FILES */}
                {project.files?.length > 0 && (
                  <div className="shrink-0 space-y-1.5 min-w-[180px]">
                    {project.files.map((file) => (
                      <button
                        key={file._id}
                        onClick={() => handleDownload(project._id, file._id)}
                        disabled={downloadingId === file._id}
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-60"
                      >
                        <Download size={11} className="shrink-0 text-indigo-500" />
                        <span className="truncate">{file.originalName}</span>
                      </button>
                    ))}
                  </div>
                )}

              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ProjectsPage;
