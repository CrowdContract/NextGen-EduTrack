import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTeacherFiles } from "../../store/slices/teacherSlice";
import { downloadProjectFile } from "../../store/slices/projectSlice";
import { ArrowDownToLine, FolderOpen } from "lucide-react";

const TeacherFiles = () => {
  const dispatch = useDispatch();
  const { files, loading } = useSelector((state) => state.teacher);
  const [search, setSearch] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    dispatch(getTeacherFiles());
  }, [dispatch]);

  const filtered = files.filter(
    (f) =>
      f.originalName?.toLowerCase().includes(search.toLowerCase()) ||
      f.projectTitle?.toLowerCase().includes(search.toLowerCase()) ||
      f.student?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = async (file) => {
    setDownloadingId(file._id);
    try {
      await dispatch(
        downloadProjectFile({ projectId: file.projectId, fileId: file._id })
      ).unwrap();
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Student Files</h1>
          <p className="card-subtitle">
            Files uploaded by your supervised students ({files.length} total)
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by file name, project, or student..."
        className="input-field w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* LIST */}
      {loading ? (
        <div className="card text-center py-8 text-slate-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-8">
          <FolderOpen className="mx-auto mb-2 text-slate-400" size={36} />
          <h3 className="text-lg font-medium text-slate-800 mb-1">No files found</h3>
          <p className="text-slate-500">No files have been uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((file) => (
            <div
              key={file._id}
              className="card border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p className="font-medium text-slate-800">{file.originalName}</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  Project: {file.projectTitle}
                </p>
                <p className="text-sm text-slate-500">
                  Student: {file.student?.name || "Unknown"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Uploaded: {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : "-"}
                </p>
              </div>

              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-60"
                disabled={downloadingId === file._id}
                onClick={() => handleDownload(file)}
              >
                <ArrowDownToLine size={16} />
                {downloadingId === file._id ? "Downloading..." : "Download"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherFiles;
