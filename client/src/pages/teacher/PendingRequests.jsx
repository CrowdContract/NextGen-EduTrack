import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  getTeacherRequests,
  acceptRequests,
  rejectRequest,
} from "../../store/slices/teacherSlice";

const SkeletonCard = () => (
  <div className="card space-y-3">
    <div className="flex items-center gap-3">
      <div className="skeleton h-5 w-32" />
      <div className="skeleton h-5 w-16 rounded-full" />
    </div>
    <div className="skeleton h-4 w-48" />
    <div className="skeleton h-4 w-40" />
    <div className="skeleton h-4 w-24" />
  </div>
);

const PendingRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loadingMap, setLoadingMap] = useState({});

  const dispatch = useDispatch();
  const { pendingRequests: list, loading } = useSelector((state) => state.teacher);
  const { authUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getTeacherRequests(authUser?._id));
  }, [dispatch, authUser?._id]);

  const setLoading = (id, key, value) => {
    setLoadingMap((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [key]: value },
    }));
  };

  const handleAccept = async (request) => {
    const id = request._id;
    setLoading(id, "accepting", true);
    try {
      await dispatch(acceptRequests(id)).unwrap();
    } finally {
      setLoading(id, "accepting", false);
    }
  };

  const handleReject = async (request) => {
    const id = request._id;
    setLoading(id, "rejecting", true);
    try {
      await dispatch(rejectRequest(id)).unwrap();
    } finally {
      setLoading(id, "rejecting", false);
    }
  };

  const filteredRequests = list.filter((request) => {
    const matchesSearch =
      request?.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request?.project?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Pending Supervision Requests</h1>
          <p className="card-subtitle">Review and respond to student supervision requests</p>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by student name or project title..."
          className="input-field flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="input-field sm:w-48"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* REQUESTS */}
      <div className="space-y-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filteredRequests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-8"
          >
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2">
              No requests found
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        ) : (
          filteredRequests.map((req, i) => {
            const id = req._id;
            const project = req.latestProject;
            const projectStatus = project?.status?.toLowerCase() || "pending";
            const supervisorAssigned = !!project?.supervisor;
            const canAccept = req.status === "pending" && !supervisorAssigned;
            const lm = loadingMap[id] || {};

            let bgClass = "";
            let statusMessage = "";

            if (req.status === "accepted") {
              bgClass = "bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-800";
            } else if (req.status === "rejected") {
              bgClass = "bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-800";
            } else if (supervisorAssigned) {
              bgClass = "bg-blue-50 dark:bg-blue-900/10 border-blue-300 dark:border-blue-800";
              statusMessage = "Supervisor already assigned";
            } else if (projectStatus === "rejected") {
              bgClass = "bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-800";
              statusMessage = "Project proposal rejected";
            } else if (projectStatus === "pending") {
              bgClass = "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-300 dark:border-yellow-800";
              statusMessage = "Project proposal pending";
            }

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                className={`card border ${bgClass} transition-all`}
              >
                <div className="flex flex-col lg:flex-row justify-between">
                  <div className="flex-1">

                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        {req?.student?.name || "Unknown Student"}
                      </h3>
                      <span className={`badge ${
                        req.status === "pending" ? "badge-pending"
                        : req.status === "accepted" ? "badge-approved"
                        : "badge-rejected"
                      }`}>
                        {req.status?.charAt(0).toUpperCase() + req.status?.slice(1)}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {req?.student?.email || "No email"}
                    </p>

                    <p className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {project?.title || "No project title"}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Submitted:{" "}
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "-"}
                    </p>

                    {statusMessage && (
                      <p className="text-sm mt-2 text-slate-600 dark:text-slate-400">{statusMessage}</p>
                    )}

                    {req.status === "pending" && (
                      <div className="flex items-center gap-3 mt-3">
                        <motion.button
                          whileHover={{ scale: canAccept ? 1.03 : 1 }}
                          whileTap={{ scale: canAccept ? 0.97 : 1 }}
                          className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-colors duration-200 ${
                            canAccept
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-slate-500 cursor-not-allowed"
                          }`}
                          disabled={lm.accepting || !canAccept}
                          onClick={() => handleAccept(req)}
                        >
                          {lm.accepting ? "Accepting..." : "Accept"}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-4 py-1.5 text-sm rounded-lg font-medium transition-colors duration-200 disabled:opacity-60 bg-red-600 hover:bg-red-700 text-white"
                          disabled={lm.rejecting}
                          onClick={() => handleReject(req)}
                        >
                          {lm.rejecting ? "Rejecting..." : "Reject"}
                        </motion.button>
                      </div>
                    )}

                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default PendingRequests;
