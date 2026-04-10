import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// ================= DASHBOARD =================
export const getTeacherDashboardStats = createAsyncThunk(
  "getTeacherDashboardStats",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/teacher/fetch-dashboard-stats");

      return res.data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );

      return thunkAPI.rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);

// ================= GET REQUESTS =================
export const getTeacherRequests = createAsyncThunk(
  "getTeacherRequests",
  async (supervisorId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        `/teacher/requests?supervisor=${supervisorId}`
      );

      return res.data.data; // { requests, total }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch requests"
      );
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// ================= GET ASSIGNED STUDENTS =================
export const getAssignedStudents = createAsyncThunk(
  "getAssignedStudents",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/teacher/assigned-students");
      return res.data.data; // { students, total }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch assigned students");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// ================= GET TEACHER FILES =================
export const getTeacherFiles = createAsyncThunk(
  "getTeacherFiles",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/teacher/files");
      return res.data.data; // { files, total }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch files");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// ================= GIVE FEEDBACK =================
export const giveFeedback = createAsyncThunk(
  "giveFeedback",
  async ({ projectId, message, type }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/teacher/feedback/${projectId}`, { message, type });
      toast.success(res.data.message || "Feedback submitted");
      return res.data.data.feedback;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit feedback");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// ================= ACCEPT REQUEST =================
export const acceptRequests = createAsyncThunk(
  "acceptRequests",
  async (requestId, thunkAPI) => {
    try {
      const res = await axiosInstance.put(
        `/teacher/requests/${requestId}/accept`
      );

      toast.success(res.data.message || "Request accepted");

      // Refresh assigned students so the list updates immediately
      thunkAPI.dispatch(getAssignedStudents());

      return res.data.data.request;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to accept request"
      );
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// ================= REJECT REQUEST =================
export const rejectRequest = createAsyncThunk(
  "rejectRequest",
  async (requestId, thunkAPI) => {
    try {
      const res = await axiosInstance.put(
        `/teacher/requests/${requestId}/reject`
      );

      toast.success(res.data.message || "Request rejected");

      return res.data.data.request;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reject request"
      );
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// ================= SLICE =================
const teacherSlice = createSlice({
  name: "teacher",
  initialState: {
    assignedStudents: [],
    files: [],
    pendingRequests: [],
    dashboardStats: null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      // 🔹 Dashboard
      .addCase(getTeacherDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeacherDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(getTeacherDashboardStats.rejected, (state) => {
        state.loading = false;
      })

      // 🔹 Get Requests
      .addCase(getTeacherRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeacherRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = action.payload.requests;
      })
      .addCase(getTeacherRequests.rejected, (state) => {
        state.loading = false;
      })

      // 🔹 Accept Request
      .addCase(acceptRequests.fulfilled, (state, action) => {
        const updatedRequest = action.payload;

        state.pendingRequests = state.pendingRequests.map((req) =>
          req._id === updatedRequest._id ? updatedRequest : req
        );
      })

      // 🔹 Reject Request
      .addCase(rejectRequest.fulfilled, (state, action) => {
        const rejectedRequest = action.payload;

        state.pendingRequests = state.pendingRequests.filter(
          (req) => req._id !== rejectedRequest._id
        );
      })

      // 🔹 Get Assigned Students
      .addCase(getAssignedStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAssignedStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedStudents = action.payload.students;
      })
      .addCase(getAssignedStudents.rejected, (state) => {
        state.loading = false;
      })

      // 🔹 Get Teacher Files
      .addCase(getTeacherFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeacherFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload.files;
      })
      .addCase(getTeacherFiles.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default teacherSlice.reducer;