import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllUsers,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../../store/slices/adminSlice";

import AddStudent from "../../components/modal/AddStudent";
import { Plus, Users, CheckCircle, TriangleAlert,AlertTriangle } from "lucide-react";

const ManageStudents = () => {
  const dispatch = useDispatch();

  const { users, projects } = useSelector((state) => state.admin);
  const { isCreateStudentModalOpen } = useSelector((state) => state.popup);

  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  });

  // ================= STUDENTS =================
  const students = useMemo(() => {
    const studentUsers = (users || []).filter(
      (u) => u.role?.toLowerCase() === "student"
    );

    return studentUsers.map((student) => {
      const studentProject = (projects || []).find(
        (p) => p.student === student._id
      );

      return {
        ...student,
        projectTitle: studentProject?.title || null,
        supervisor: studentProject?.supervisor || null,
        projectStatus: studentProject?.status || null,
      };
    });
  }, [users, projects]);

  // ================= FETCH =================

  // ================= DEPARTMENTS =================
  const departments = useMemo(() => {
    const set = new Set(students.map((s) => s.department).filter(Boolean));
    return Array.from(set);
  }, [students]);

  // ================= FILTER =================
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      (student.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (student.email || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterDepartment === "all" ||
      student.department === filterDepartment;

    return matchesSearch && matchesFilter;
  });

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingStudent) {
      dispatch(
        updateStudent({
          id: editingStudent._id,
          data: formData,
        })
      );
    } else {
      dispatch(createStudent(formData));
    }

    handleCloseModal();
  };

  // ================= CLOSE MODAL =================
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({
      name: "",
      email: "",
      department: "",
    });
  };

  // ================= EDIT =================
  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      department: student.department,
    });
    setShowModal(true);
  };

  // ================= DELETE =================
  const handleDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      dispatch(deleteStudent(studentToDelete._id));
      setShowDeleteModal(false);
      setStudentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setStudentToDelete(null);
    setShowDeleteModal(false);
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <div>
            <h1 className="card-title">Manage Students</h1>
            <p className="card-subtitle">
              Add, edit, and manage student accounts
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Student
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="card flex items-center p-4">
          <Users className="text-blue-600" />
          <div className="ml-3">
            <p>Total Students</p>
            <h2>{students.length}</h2>
          </div>
        </div>

        <div className="card flex items-center p-4">
          <CheckCircle className="text-purple-600" />
          <div className="ml-3">
            <p>Total Projects</p>
            <h2>{students.length}</h2>
          </div>
        </div>

        <div className="card flex items-center p-4">
          <CheckCircle className="text-green-600" />
          <div className="ml-3">
            <p>Completed</p>
            <h2>
              {students.filter((s) => s.projectStatus === "completed").length}
            </h2>
          </div>
        </div>

        <div className="card flex items-center p-4">
          <TriangleAlert className="text-yellow-600" />
          <div className="ml-3">
            <p>Unassigned</p>
            <h2>{students.filter((s) => !s.supervisor).length}</h2>
          </div>
        </div>

      </div>

      {/* SEARCH + FILTER */}
<div className="card">
  <div className="flex flex-col md:flex-row gap-4">

    {/* SEARCH */}
    <div className="flex-1">
      <label className="block text-sm font-medium text-sky-700 mb-2">
        Search Students
      </label>
      <input
        type="text"
        placeholder="Search by name or email..."
        className="input-field w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    {/* FILTER */}
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

        {departments.map((dept, index) => (
          <option key={index} value={dept}>
            {dept}
          </option>
        ))}
      </select>
    </div>

  </div>
</div>

      {/* TABLE */}
  {/* STUDENTS TABLE */}
{/* ================= STUDENTS TABLE ================= */}

{filteredStudents.length === 0 ? (

  <div className="card">
    <div className="text-center py-8 text-slate-500">
      No students found matching your criteria.
    </div>
  </div>

) : (

  <div className="card">
    
    <div className="card-header">
      <h2 className="card-title">Students List</h2>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">

        {/* ================= HEADER ================= */}
        <thead className="bg-slate-50">
          <tr>

            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
              Student Info
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
              Department & Year
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
              Supervisor
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
              Project
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
              Actions
            </th>

          </tr>
        </thead>

        {/* ================= BODY ================= */}
        <tbody className="bg-white divide-y divide-slate-200">
          {filteredStudents.map((student) => (
            <tr key={student._id} className="hover:bg-slate-50">

              {/* STUDENT INFO */}
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-slate-900">
                  {student.name}
                </div>
                <div className="text-sm text-slate-500">
                  {student.email}
                </div>
              </td>

              {/* DEPARTMENT & YEAR */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-900">
                  {student.department || "-"}
                </div>
                <div className="text-sm text-slate-500">
                  {student.createdAt
                    ? new Date(student.createdAt).getFullYear()
                    : "-"}
                </div>
              </td>

    <td className="px-6 py-4 whitespace-nowrap">
  {student.supervisor ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-green-800 bg-green-100">
      {users?.find((u) => u._id === student?.supervisor)?.name}
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-red-800 bg-red-100">
      {student.projectStatus === "rejected"
        ? "Rejected"
        : "Not Assigned"}
    </span>
  )}
</td>

              {/* PROJECT TITLE */}
              <td className="px-6 py-4">
                <div className="text-sm text-slate-900">
                  {student.projectTitle || "No Project"}
                </div>
              </td>

              {/* ACTIONS */}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex gap-3">

                  <button
                    onClick={() => handleEdit(student)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(student)}
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

    {/* ================= EDIT STUDENT MODAL ================= */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Edit Student
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
            Department
          </label>

          <select
            required
            value={formData.department}
            onChange={(e) =>
              setFormData({
                ...formData,
                department: e.target.value,
              })
            }
            className="input-field w-full p-2 border border-slate-600 focus:outline-none"
          >
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Data Science">Data Science</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="Business Administration">Business Administration</option>
            <option value="Economics">Economics</option>
            <option value="Psychology">Psychology</option>
          </select>
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
            Update Student
          </button>

        </div>

      </form>
    </div>
  </div>
)}

  </div>

  

)}

{/* ================= DELETE STUDENT MODAL ================= */}
{showDeleteModal && studentToDelete && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">

      {/* ICON */}
      <div className="flex justify-center mb-4">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
      </div>

      {/* TEXT */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Delete Student
        </h3>

        <p className="text-sm text-slate-500 mb-4">
          Are you sure you want to delete{" "}
          <span className="font-medium text-slate-900">
            {studentToDelete.name}
          </span>
          ? This action cannot be undone.
        </p>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-center space-x-3">

        <button
          onClick={cancelDelete}
          className="btn-secondary"
        >
          Cancel
        </button>

        <button
          onClick={confirmDelete}
          className="btn-danger"
        >
          Delete
        </button>

      </div>

    </div>
  </div>
)}

      {/* ADD STUDENT MODAL */}
   {showModal && !editingStudent && (
  <AddStudent handleCloseModal={() => setShowModal(false)} />
)}   
   </div>
  );
};

export default ManageStudents;