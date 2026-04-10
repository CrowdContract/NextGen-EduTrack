import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllUsers,
  deleteTeacher,
  updateTeacher,
} from "../../store/slices/adminSlice";

import {
  Plus,
  Users,
  CheckCircle,
  TriangleAlert,
  AlertTriangle,
} from "lucide-react";
import AddTeacher from "../../components/modal/AddTeacher";

const ManageTeachers = () => {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.admin);

  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

 const [formData, setFormData] = useState({
  name: "",
  email: "",
  department: "",
  password: "",
  joinDate: "", 
  maxStudents: "",
});

  // ================= TEACHERS =================
  const teachers = useMemo(() => {
    return (users || []).filter(
      (u) => u.role?.toLowerCase() === "teacher"
    );
  }, [users]);

  // ================= FETCH =================
 

  // ================= DEPARTMENTS =================
  const departments = useMemo(() => {
    const set = new Set(teachers.map((t) => t.department).filter(Boolean));
    return Array.from(set);
  }, [teachers]);

  // ================= FILTER =================
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      (teacher.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (teacher.email || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterDepartment === "all" ||
      teacher.department === filterDepartment;

    return matchesSearch && matchesFilter;
  });

  // ================= EDIT =================
  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
  name: teacher.name,
  email: teacher.email,
  department: teacher.department,
  joinDate: teacher.joinDate
    ? teacher.joinDate.split("T")[0]
    : "",
  maxStudents: teacher.maxStudents || 10,
});
    setShowModal(true);
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();

  dispatch(
  updateTeacher({
    id: editingTeacher._id,
    data: {
      ...formData,
      joinDate: formData.joinDate,
    },
  })
);

    handleCloseModal();
  };

  // ================= CLOSE MODAL =================
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTeacher(null);
  };

  // ================= DELETE =================
  const handleDelete = (teacher) => {
    setTeacherToDelete(teacher);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (teacherToDelete) {
      dispatch(deleteTeacher(teacherToDelete._id));
      setShowDeleteModal(false);
      setTeacherToDelete(null);
    }
  };

  const cancelDelete = () => {
    setTeacherToDelete(null);
    setShowDeleteModal(false);
  };

  return (
    <div className="p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <div>
            <h1 className="card-title">Manage Teachers</h1>
            <p className="card-subtitle">
              Add, edit, and manage teacher accounts
            </p>
          </div>

          <button
  onClick={() => setShowModal(true)}
  className="btn-primary flex items-center gap-2"
>
  <Plus className="w-5 h-5" />
  Add Teacher
</button>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="card flex items-center p-4">
          <Users className="text-blue-600" />
          <div className="ml-3">
            <p>Total Teachers</p>
            <h2>{teachers.length}</h2>
          </div>
        </div>

        <div className="card flex items-center p-4">
          <CheckCircle className="text-green-600" />
          <div className="ml-3">
            <p>Total Assigned Students</p>
            <h2>
              {teachers.reduce(
                (sum, t) => sum + (t.assignedStudents?.length || 0),
                0
              )}
            </h2>
          </div>
        </div>

        <div className="card flex items-center p-4">
          <TriangleAlert className="text-yellow-600" />
          <div className="ml-3">
            <p>Departments</p>
            <h2>{departments.length}</h2>
          </div>
        </div>

      </div>

      {/* ================= SEARCH + FILTER ================= */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">

          <div className="flex-1">
            <label className="block text-sm font-medium text-sky-700 mb-2">
              Search Teachers
            </label>
            <input
              type="text"
              placeholder="Search by name or email..."
              className="input-field w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filter Department
            </label>

            <select
              className="input-field w-full"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map((dept, i) => (
                <option key={i}>{dept}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* ================= TABLE ================= */}
     {filteredTeachers.length === 0 ? (

  <div className="card">
    <div className="text-center py-8 text-slate-500">
      No teachers found matching your criteria.
    </div>
  </div>

) : (

  <div className="card">
    
    <div className="card-header">
      <h2 className="card-title">Teachers List</h2>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">

        {/* ================= HEADER ================= */}
        <thead className="bg-slate-50">
          <tr>

            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
              Teacher Info
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
              Expertise
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
              Join Date
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
              Max Students
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
              Actions
            </th>

          </tr>
        </thead>

        {/* ================= BODY ================= */}
        <tbody className="bg-white divide-y divide-slate-200">
          {filteredTeachers.map((teacher) => (
            <tr key={teacher._id} className="hover:bg-slate-50">

              {/* TEACHER INFO */}
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-slate-900">
                  {teacher.name}
                </div>
                <div className="text-sm text-slate-500">
                  {teacher.email}
                </div>
              </td>

              

              {/* EXPERTISE */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-900">
                  {Array.isArray(teacher.expertise)
                    ? teacher.expertise.join(", ")
                    : teacher.expertise || "-"}
                </div>
              </td>
              {/* JOIN DATE */}
<td className="px-6 py-4 whitespace-nowrap">
  <div className="text-sm text-slate-900">
    {teacher.joinDate
      ? new Date(teacher.joinDate).toLocaleDateString()
      : "-"}
  </div>
</td>

              {/* MAX STUDENTS */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-900">
                  {teacher.maxStudents || 0}
                </div>
              </td>

              {/* ACTIONS */}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex gap-3">

                  <button
                    onClick={() => handleEdit(teacher)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(teacher)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>

                </div>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>

  </div>

)}
   {showModal && editingTeacher && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Edit Teacher
        </h3>

        <button
          onClick={handleCloseModal}
          className="text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* NAME */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="input-field w-full p-2 border border-slate-600 focus:outline-none"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="input-field w-full p-2 border border-slate-600 focus:outline-none"
          />
        </div>

        {/* DEPARTMENT */}
      <div>
  <label className="block text-sm font-medium text-slate-700 mb-1">
    Area of Expertise
  </label>

  <select
    value={formData.expertise}
    onChange={(e) =>
      setFormData({
        ...formData,
        expertise: e.target.value,
      })
    }
    className="input-field w-full p-2 border border-slate-600 focus:outline-none"
  >
    <option value="">Select Area of Expertise</option>

    <option value="Artificial Intelligence">Artificial Intelligence</option>
    <option value="Machine Learning">Machine Learning</option>
    <option value="Data Science">Data Science</option>
    <option value="Cybersecurity">Cybersecurity</option>
    <option value="Cloud Computing">Cloud Computing</option>
    <option value="Software Development">Software Development</option>
    <option value="Web Development">Web Development</option>
    <option value="Mobile App Development">Mobile App Development</option>
    <option value="Database Systems">Database Systems</option>
    <option value="Computer Networks">Computer Networks</option>
    <option value="Operating Systems">Operating Systems</option>
    <option value="Human-Computer Interaction">Human-Computer Interaction</option>
    <option value="Big Data Analytics">Big Data Analytics</option>
    <option value="Blockchain Technology">Blockchain Technology</option>
    <option value="Internet of Things (IoT)">Internet of Things (IoT)</option>

  </select>
</div>
      {/* JOIN DATE */}
<div>
  <label className="block text-sm font-medium text-slate-700 mb-1">
    Join Date
  </label>

  <input
    type="date"
    required
    value={formData.joinDate}
    onChange={(e) =>
      setFormData({ ...formData, joinDate: e.target.value })
    }
    className="input-field w-full p-2 border border-slate-600 focus:outline-none"
  />
</div>

        {/* MAX STUDENTS */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Max Students
          </label>
          <input
            type="number"
            min="1"
            value={formData.maxStudents}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxStudents: Number(e.target.value),
              })
            }
            className="input-field w-full p-2 border border-slate-600 focus:outline-none"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end space-x-3 pt-4">

          <button
            type="button"
            onClick={handleCloseModal}
            className="btn-secondary"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn-primary"
          >
            Update Teacher
          </button>

        </div>

      </form>
    </div>
  </div>
)}  

      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal && teacherToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-6 rounded-lg text-center">

            <AlertTriangle className="mx-auto text-red-500 mb-3" />

            <p>
              Delete <b>{teacherToDelete.name}</b>?
            </p>

            <div className="flex justify-center gap-3 mt-4">
              <button onClick={cancelDelete}>Cancel</button>
              <button onClick={confirmDelete} className="text-red-600">
                Delete
              </button>
            </div>

          </div>
        </div>
      )}
{showModal && !editingTeacher && (
  <AddTeacher handleCloseModal={() => setShowModal(false)} />
)}    </div>
  );
};

export default ManageTeachers;