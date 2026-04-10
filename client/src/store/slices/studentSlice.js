import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// ================= SUBMIT PROPOSAL =================
export const submitProjectProposal = createAsyncThunk(
  "student/submitProjectProposal",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/student/project-proposal", data);

      toast.success("Project proposal submitted successfully");

      return res.data.data.project;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to submit project proposal";

      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ================= FETCH PROJECT =================
export const fetchProject = createAsyncThunk(
  "student/fetchProject",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/student/project");
      return res.data.data.project;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch project";

      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ================= GET SUPERVISOR =================
export const getSupervisor = createAsyncThunk(
  "student/getSupervisor",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/student/supervisor");
      return res.data.data.supervisor;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch supervisor";

      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ================= FETCH ALL SUPERVISORS =================
export const fetchAllSupervisors = createAsyncThunk(
  "student/fetchAllSupervisors",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/student/fetch-supervisors");
      return res.data.data.supervisors;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to fetch available supervisors";

      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ================= REQUEST SUPERVISOR =================
export const requestSupervisor = createAsyncThunk(
  "student/requestSupervisor",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        "/student/request-supervisor",
        data
      );

      thunkAPI.dispatch(getSupervisor());

      toast.success(res.data?.message || "Supervisor requested successfully");

      return res.data?.data?.request;

    } catch (error) {
      console.error("🔥 REQUEST SUPERVISOR ERROR:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to request supervisor";

      toast.error(message);

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ================= UPLOAD FILES =================
export const uploadFiles = createAsyncThunk(
  "student/uploadFiles",
  async ({ projectId, files }, thunkAPI) => {
    try {
      const form = new FormData();

      for (const file of files) {
        form.append("files", file);
      }

      const res = await axiosInstance.post(
        `/student/upload/${projectId}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message || "Files uploaded successfully");

      return res.data.data?.project || res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to upload file";

      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  "student/fetchDashboardStats",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/student/fetch-dashboard-stats");

      return res.data.data || res.data;
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
export const getFeedback = createAsyncThunk(
  "student/getFeedback",
  async (projectId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        `/student/feedback/${projectId}`
      );

      return (
        res.data?.data?.feedback ||
        res.data?.data ||
        res.data
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch feedback"
      );

      return thunkAPI.rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);

export const downloadFile = createAsyncThunk(
  "student/downloadFile",
  async ({ projectId, fileId }, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        `/student/download/${projectId}/${fileId}`,
        {
          responseType: "blob",
        }
      );

      return { blob: res.data, projectId, fileId };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to download file"
      );

      return thunkAPI.rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);

// ================= SLICE =================
const studentSlice = createSlice({
  name: "student",
  initialState: {
    project: null,
    supervisors: [],
    supervisor: null,
    files: [],
     dashboardStats: null, // ✅ FIXED (added)
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ================= SUCCESS CASES =================
      .addCase(submitProjectProposal.fulfilled, (state, action) => {
        state.project = action.payload;
      })

      .addCase(fetchProject.fulfilled, (state, action) => {
        state.project = action.payload || null;
      })

      .addCase(getSupervisor.fulfilled, (state, action) => {
        state.supervisor = action.payload || null;
      })

      .addCase(fetchAllSupervisors.fulfilled, (state, action) => {
        state.supervisors = action.payload || [];
      })

     .addCase(uploadFiles.fulfilled, (state, action) => {
  // 🔥 action.payload is already project
  state.project = action.payload;

  // 🔥 update files from project
  state.files = action.payload.files || [];
})

        // optional: update full project also
        
      
.addCase(fetchDashboardStats.fulfilled, (state, action) => {
  console.log("API RESPONSE:", action.payload);

  state.dashboardStats = action.payload; // ✅ FIX HERE
})
.addCase(getFeedback.fulfilled, (state, action) => {
  state.feedback = action.payload || [];
})


      // ================= MATCHERS =================
      .addMatcher(
        (action) =>
          action.type.startsWith("student/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addMatcher(
        (action) =>
          action.type.startsWith("student/") &&
          action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )

      .addMatcher(
        (action) =>
          action.type.startsWith("student/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default studentSlice.reducer;