import { useDebugValue, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAllSupervisors,
  fetchProject,
  getSupervisor,
  requestSupervisor,
} from "../../store/slices/studentSlice";

const SupervisorPage = () => {
  const dispatch = useDispatch();

  const { authUser } = useSelector((state) => state.auth);
  const { project, supervisors, supervisor } = useSelector(
    (state) => state.student
  );
const [deadline, setDeadline] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);

  useEffect(() => {
    dispatch(fetchProject());
    dispatch(getSupervisor());
    dispatch(fetchAllSupervisors());
  }, [dispatch]);

  const hasSupervisor = useMemo(() => {
    return !!(supervisor && supervisor._id);
  }, [supervisor]);

 const hasProject = useMemo(() => {
    return !!(project && project._id);
  }, [project]);
  const formatDeadline = (dateStr) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";

    const day = date.getDate();
    const j = day % 10;
    const k = day % 100;

    const suffix =
      j === 1 && k !== 11
        ? "st"
        : j === 2 && k !== 12
        ? "nd"
        : j === 3 && k !== 13
        ? "rd"
        : "th";

    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    return `${day}${suffix} ${month} ${year}`;
  };
  const handleOpenRequest = (supervisor) => {
  setSelectedSupervisor(supervisor);
  setShowRequestModal(true);
};

const submitRequest = () => {
  if (!selectedSupervisor) return;

  const message =
    requestMessage?.trim() ||
    `${authUser?.name || "Student"} has request ${
      selectedSupervisor.name
    } to be their supervisor.`;

dispatch(
  requestSupervisor({
    teacherId: selectedSupervisor._id,
    message,
    deadline,   // ✅ THIS IS MISSING
  })
);
};

return (
  <div className="space-y-6">
    {/* CURRENT SUPERVISOR */}
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">Current Supervisor</h1>
        {hasSupervisor && (
          <span className="badge badge-approved">Assigned</span>
        )}
      </div>
    </div>

    {/* SUPERVISOR DETAILS */}
    {hasSupervisor ? (
      <div className="space-y-6">
        <div className="flex items-start space-x-6">
          <img
            src="/placeholder.jpg"
            alt="Supervisor Avatar"
            className="w-20 h-20 rounded-full object-cover shadow-md"
          />

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">
                {supervisor?.name || "-"}
              </h3>
              <p className="text-lg text-slate-600">
                {supervisor?.department || "-"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                  Email
                </label>
                <p className="text-slate-800 font-medium">
                  {supervisor?.email || "-"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                  Expertise
                </label>
                <p className="text-slate-800 font-medium">
                  {Array.isArray(supervisor?.expertise)
                    ? supervisor.expertise.join(", ")
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="p-6 text-center">
        <p className="text-slate-600 text-lg">
          Supervisor not assigned yet.
        </p>
      </div>
    )}
    {/* PROJECT DETAILS */}
      {hasProject && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Project Details</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-500 uppercase">
                    Project Title
                  </label>
                  <p className="text-lg font-semibold text-slate-800">
                    {project?.title || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-slate-500 uppercase">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      project?.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : project?.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : project?.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {project?.status || "unknown"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-500 uppercase">
                    Deadline
                  </label>
                  <p className="text-lg font-semibold text-slate-800">
                    {project?.deadline
                      ? formatDeadline(project.deadline)
                      : "No deadline set"}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-slate-500 uppercase">
                    Created
                  </label>
                  <p className="text-lg font-semibold text-slate-800">
                    {project?.createdAt
                      ? formatDeadline(project.createdAt)
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            {project?.description && (
              <div>
                <label className="text-sm text-slate-500 uppercase">
                  Description
                </label>
                <p className="text-slate-700 mt-2">
                  {project.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* IF NO PROJECT */}
{!hasProject && (
  <div className="card">
    <div className="card-header">
      <h2 className="card-title">Project Required</h2>
    </div>
    <div className="p-6 text-center">
      <p className="text-slate-600 text-lg">
        You haven't submitted any project proposal yet, so you cannot request a supervisor.
      </p>
    </div>
  </div>
)}

{/* AVAILABLE SUPERVISORS | ONLY WHEN PROJECT EXISTS AND NO SUPERVISOR ASSIGNED */}
{hasProject && !hasSupervisor && (
  <div className="card">
    <div className="card-header">
      <h2 className="card-title">Available Supervisors</h2>
      <p className="card-subtitle">
        Browse and request supervision from available faculty members
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {supervisors &&
        supervisors.map((sup) => (
          <div
            key={sup._id}
            className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center">
                <span>{sup.name || "Anonymous"}</span>
              </div>
            </div>

            <div className="flex-1">
              <h4 className="font-medium text-slate-800">
                {sup.name}
              </h4>

              <p className="text-sm text-slate-600">
                {sup.email}
              </p>

              <p>{sup.department}</p>
            </div>

            <div className="space-y-2 mb-4">
              <div>
                <label className="text-xs font-medium text-slate-500">
                  Email
                </label>
                <p className="text-sm text-slate-700">
                  {sup.email || "-"}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500">
                  Expertise
                </label>
                <p className="text-sm text-slate-700">
                  {Array.isArray(sup.expertise)
                    ? sup.expertise.join(", ")
                    : sup.expertise || "-"}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleOpenRequest(sup)}
              className="btn-primary w-full"
            >
              Request Supervisor
            </button>
          </div>
        ))}
    </div>
  </div>
)}

{/* REQUEST MODAL */}
{showRequestModal && selectedSupervisor && (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="p-6">

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Request Supervision
          </h3>

          <button
            className="text-slate-400 hover:text-slate-600"
            onClick={() => {
              setShowRequestModal(false);
              setSelectedSupervisor(null);
              setRequestMessage("");
            }}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-md">
            <p className="text-sm text-slate-600">
              {selectedSupervisor?.name}
            </p>
          </div>

          <div>
            <label className="label">Message to Supervisor</label>

            <textarea
              className="input min-h-[120px]"
              required
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              placeholder="Introduce yourself and explain why you'd like this professor to supervise your project..."
            />
            <input
  type="date"
  className="input"
  value={deadline}
  onChange={(e) => setDeadline(e.target.value)}
/>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 mt-4">
          <button
            onClick={() => {
              setShowRequestModal(false);
              setSelectedSupervisor(null);
              setRequestMessage("");
            }}
            className="btn-outline"
          >
            Cancel
          </button>

          <button
            onClick={submitRequest}
            className="btn-primary"
            disabled={!selectedSupervisor}
          >
            Send Request
          </button>
        </div>

      </div>
    </div>
  </div>
)}
    </div>
  );
};

  

export default SupervisorPage;
