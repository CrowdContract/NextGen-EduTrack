import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CheckCircle, AlertTriangle, Users } from "lucide-react";
import {
  getAllUsers,
  getAllProjects,
  assignSupervisor,
} from "../../store/slices/adminSlice";

const AssignSupervisor = () => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedSupervisor, setSelectedSupervisor] = useState({});
  const [pendingFor, setPendingFor] = useState(null);

  const { users, projects } = useSelector((state) => state.admin);

  useEffect(() => {
    if (!users || users.length === 0) dispatch(getAllUsers());
    if (!projects || projects.length === 0) dispatch(getAllProjects());
  }, [dispatch]);

  // ================= TEACHERS =================
  const teachers = useMemo(() => {
    const teacherUsers = (users || []).filter(
      (u) => (u.role || "").toLowerCase() === "teacher"
    );

    return teacherUsers.map((t) => ({
      ...t,
      assignedCount: Array.isArray(t.assignedStudents)
        ? t.assignedStudents.length
        : 0,
      capacityLeft:
        (typeof t.maxStudents === "number" ? t.maxStudents : 0) -
        (Array.isArray(t.assignedStudents)
          ? t.assignedStudents.length
          : 0),
    }));
  }, [users]);

  // ================= PROJECTS =================
  const studentProjects = useMemo(() => {
    return (projects || [])
      .filter((p) => !!p.student?._id)
      .map((p) => ({
        projectId: p._id,
        title: p.title,
        status: p.status,
supervisor: p.supervisor?.name || null,
        studentId: p.student?._id || null,
        studentName: p.student?.name || "-",
        studentEmail: p.student?.email || "-",
        deadline: p.deadline
          ? new Date(p.deadline).toISOString().slice(0, 10)
          : "-",
        updatedAt: p.updatedAt
          ? new Date(p.updatedAt).toLocaleString()
          : "-",
        isApproved: p.status === "approved",
      }));
  }, [projects]);

  // ================= FILTER =================
  const filtered = studentProjects.filter((row) => {
    const matchesSearch =
      (row.studentName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (row.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const status = row.supervisor ? "assigned" : "unassigned";
    const matchesFilter =
      filterStatus === "all" || status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // ================= SELECT =================
  const handleSupervisorSelect = (projectId, supervisorId) => {
    setSelectedSupervisor((prev) => ({
      ...prev,
      [projectId]: supervisorId,
    }));
  };

  // ================= ASSIGN =================
  const handleAssign = async (studentId, projectStatus, projectId) => {
    const supervisorId = selectedSupervisor[projectId];

    if (!studentId || !supervisorId) {
      toast.error("Please select a supervisor first");
      return;
    }

if (projectStatus === "rejected") {
  toast.error("Cannot assign supervisor to a rejected project");
  return;
}

    setPendingFor(projectId);

    const res = await dispatch(
      assignSupervisor({ studentId, supervisorId })
    );

    setPendingFor(null);

    if (assignSupervisor.fulfilled.match(res)) {
      toast.success("Supervisor assigned successfully");

      setSelectedSupervisor((prev) => {
        const newState = { ...prev };
        delete newState[projectId];
        return newState;
      });

      dispatch(getAllUsers());
      dispatch(getAllProjects());
    } else {
      toast.error(res.payload || "Assignment failed");
    }
  };

  // ================= DASHBOARD =================
 const dashboardCards = [
  {
    title: "Assigned Students",
    value: studentProjects.filter((r) => !!r.supervisor).length,
    icon: CheckCircle,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    title: "Unassigned Students",
    value: studentProjects.filter((r) => !r.supervisor).length,
    icon: AlertTriangle,
    bg: "bg-red-100",
    color: "text-red-600",
  },
  {
    title: "Available Teachers",
    value: teachers.filter(
      (t) => (t.assignedCount ?? 0) < (t.maxStudents ?? 0)
    ).length,
    icon: Users,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
];
const headers = [
  "Student",
  "Project Title",
  "Supervisor",
  "Deadline",
  "Updated",
  "Assign Supervisor",
  "Actions",
];
const Badge = ({ color, children }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
    >
      {children}
    </span>
  );
};

return (
  <div className="space-y-6">
    
    {/* HEADER */}
    <div className="card">
      <div className="card-header flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="card-title">Assign Supervisor</h1>
          <p className="card-subtitle">
            Manage supervisor assignments for students and projects
          </p>
        </div>
      </div>
    </div>

    {/* FILTER */}
    <div className="card">
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* SEARCH */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Search Students
          </label>
          <input
            type="text"
            placeholder="Search by student name or project title..."
            className="input-field w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* FILTER STATUS */}
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Filter Status
          </label>
          <select
            className="input-field w-full"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Students</option>
            <option value="assigned">Assigned</option>
            <option value="unassigned">Unassigned</option>
          </select>
        </div>

      </div>
    </div>

    {/* TABLE */}
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Student Assignments</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          
          {/* HEADER */}
          <thead className="bg-slate-50">
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="bg-white divide-y divide-slate-200">
            {filtered.map((row) => (
              <tr key={row.projectId} className="hover:bg-slate-50">

                {/* STUDENT */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">
                    {row.studentName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {row.studentEmail}
                  </div>
                </td>

                {/* PROJECT TITLE */}
                <td className="px-6 py-4">
                  {row.title}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
  {row.supervisor && row.supervisor !== "Not Assigned" ? (
    <Badge color="bg-green-100 text-green-800">
      {row.supervisor}
    </Badge>
  ) : (
    <Badge color="bg-red-100 text-red-800">
      {row.status === "rejected"
        ? "Rejected"
        : "Not Assigned"}
    </Badge>
  )}
</td>

                {/* DEADLINE */}
                <td className="px-6 py-4">
                  {row.deadline}
                </td>

                {/* UPDATED */}
                <td className="px-6 py-4">
                  {row.updatedAt}
                </td>

                {/* ASSIGN SUPERVISOR */}
                <td className="px-6 py-4">
                  <select
                    className="input-field w-full"
                    value={selectedSupervisor[row.projectId] || ""}
                    onChange={(e) =>
                      handleSupervisorSelect(row.projectId, e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} ({t.capacityLeft} left)
                      </option>
                    ))}
                  </select>
                </td>

                {/* ACTION */}
               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  <button
    className={`btn-primary text-sm ${
      pendingFor === row.projectId
        ? "opacity-50 cursor-not-allowed"
        : ""
    }`}
    onClick={() =>
      handleAssign(row.studentId, row.status, row.projectId)
    }
    disabled={
      pendingFor === row.projectId ||      // loading
      !!row.supervisor ||                  // already assigned
      row.status === "rejected" ||         // rejected project
      !selectedSupervisor[row.projectId]   // no supervisor selected
    }
  >
    {pendingFor === row.projectId
      ? "Assigning..."
      : row.supervisor
      ? "Assigned"
      : row.status === "rejected"
      ? "Rejected"
      : !selectedSupervisor[row.projectId]
      ? "Select Supervisor"
      : "Assign"}
  </button>
</td>

              </tr>
            ))}
          </tbody>

        </table>
{filtered.length === 0 && (
  <div className="text-center py-8 text-slate-500">
    No students found matching your criteria
  </div>
)}


      </div>



    </div>

    {/* SUMMARY */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {dashboardCards.map((card, index) => {
    const Icon = card.icon;

    return (
      <div key={index} className="card">
        <div className="flex items-center">
          <div className={`p-3 ${card.bg} rounded-lg`}>
            <Icon className={`w-6 h-6 ${card.color}`} />
          </div>

          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">
              {card.title}
            </p>
            <p className="text-lg font-semibold text-slate-800">
              {card.value}
            </p>
          </div>
        </div>
      </div>
    );
  })}
</div>

  </div>
);
};

export default AssignSupervisor;