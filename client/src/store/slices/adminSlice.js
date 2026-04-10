import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// ================= CREATE STUDENT =================
export const createStudent = createAsyncThunk(
  "admin/createStudent",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/admin/create-student", data);
      toast.success(res.data.message || "Student created successfully");
      return res.data.user;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create student";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ================= UPDATE STUDENT =================
export const updateStudent = createAsyncThunk(
  "admin/updateStudent",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(
        `/admin/update-student/${id}`,
        data
      );
      toast.success(res.data.message || "Student updated successfully");
      return res.data.user;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update student";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ================= DELETE STUDENT =================
export const deleteStudent = createAsyncThunk(
  "admin/deleteStudent",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(
        `/admin/delete-student/${id}`
      );
      toast.success(res.data.message || "Student deleted successfully");
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete student";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ================= GET ALL USERS =================
export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/admin/users");
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch users";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ================= CREATE TEACHER =================
export const createTeacher = createAsyncThunk(
  "admin/createTeacher",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/admin/create-teacher", data);
      toast.success(res.data.message || "Teacher created successfully");
      return res.data.data || res.data.user;
    }catch (error) {
  console.log("ERROR:", error.response?.data); // 🔥 ADD THIS
  const message =
    error.response?.data?.message || "Failed to create teacher";
  toast.error(message);
  return thunkAPI.rejectWithValue(message);
}
  }
);

// ================= UPDATE TEACHER =================
export const updateTeacher = createAsyncThunk(
  "admin/updateTeacher",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(
        `/admin/update-teacher/${id}`,
        data
      );
      toast.success(res.data.message || "Teacher updated successfully");
      return res.data.data || res.data.user;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update teacher";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ================= DELETE TEACHER =================
export const deleteTeacher = createAsyncThunk(
  "admin/deleteTeacher",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(
        `/admin/delete-teacher/${id}`
      );
      toast.success(res.data.message || "Teacher deleted successfully");
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete teacher";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const assignSupervisor = createAsyncThunk(
  "assignSupervisor",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        "/admin/assign-supervisor",
        data
      );

      toast.success(res.data.message);
      return res.data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to assign supervisor"
      );

      return thunkAPI.rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);

export const getAllProjects = createAsyncThunk(
  "admin/getAllProjects",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/admin/projects");
      return res.data.data.projects; // ✅ FIXED (match backend)
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch projects"
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error"
      );
    }
  }
);
export const getDashboardStats = createAsyncThunk(
  "getDashboardStats",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/admin/fetch-dashboard-stats");
      return res.data.data.stats;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch admin dashboard stats"
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);
// ================= SLICE =================
const adminSlice = createSlice({
  name: "admin",

  initialState: {
    students: [],
    teachers: [],
    users: [],
    projects: [],
    stats: null,
    totalUsers: 0,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ===== STUDENT =====
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students.push(action.payload);
        state.users.push(action.payload);
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;

        state.students = state.students.map((s) =>
          s._id === action.payload._id ? action.payload : s
        );

        state.users = state.users.map((u) =>
          u._id === action.payload._id ? action.payload : u
        );
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;

        state.students = state.students.filter(
          (s) => s._id !== action.payload
        );
        state.users = state.users.filter(
          (u) => u._id !== action.payload
        );
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== USERS =====
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;

        const allUsers = action.payload.data;

        state.users = allUsers;
        state.totalUsers = action.payload.total;

        state.students = allUsers.filter((u) => u.role === "Student");
        state.teachers = allUsers.filter((u) => u.role === "Teacher");
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       .addCase(getAllProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

     
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload; // ✅ FIXED
      })

     
      .addCase(getAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== TEACHER =====
      .addCase(createTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers.push(action.payload);
        state.users.push(action.payload);
      })
      .addCase(createTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        state.loading = false;

        state.teachers = state.teachers.map((t) =>
          t._id === action.payload._id ? action.payload : t
        );

        state.users = state.users.map((u) =>
          u._id === action.payload._id ? action.payload : u
        );
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.loading = false;

        state.teachers = state.teachers.filter(
          (t) => t._id !== action.payload
        );

        state.users = state.users.filter(
          (u) => u._id !== action.payload
        );
      })
      .addCase(deleteTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
   .addCase(getDashboardStats.pending, (state) => {
  state.loading = true;
})

.addCase(getDashboardStats.fulfilled, (state, action) => {
  state.loading = false;
  state.stats = action.payload; // ✅ IMPORTANT FIX
})
.addCase(assignSupervisor.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(assignSupervisor.fulfilled, (state, action) => {
  state.loading = false;

  const { student, supervisor } = action.payload;

  // update student in users list
  state.users = state.users.map((u) =>
    u._id === student._id ? student : u
  );

  // update teacher in users list
  state.users = state.users.map((u) =>
    u._id === supervisor._id ? supervisor : u
  );

  // optional: update teachers array
  state.teachers = state.teachers.map((t) =>
    t._id === supervisor._id ? supervisor : t
  );
})

.addCase(assignSupervisor.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

.addCase(getDashboardStats.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});
  },
});

export default adminSlice.reducer;