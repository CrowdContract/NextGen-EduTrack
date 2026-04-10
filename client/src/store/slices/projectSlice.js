import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

/* =========================================================
   🔹 GET ALL PROJECTS
========================================================= */
export const getAllProjects = createAsyncThunk(
  "project/getAllProjects",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/project");
      return res.data.data.projects;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch projects";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* =========================================================
   🔹 DOWNLOAD PROJECT FILE
========================================================= */
export const downloadProjectFile = createAsyncThunk(
  "project/downloadProjectFile",
  async ({ projectId, fileId }, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        `/project/${projectId}/files/${fileId}/download`,
        {
          responseType: "blob", // 🔥 required
        }
      );

      return { blob: res.data, projectId, fileId };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to download file";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* =========================================================
   🔹 SLICE
========================================================= */
export const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
    selected: null,
    loading: false,
    error: null,
  },

  reducers: {
    setSelectedProject: (state, action) => {
      state.selected = action.payload;
    },
    clearSelectedProject: (state) => {
      state.selected = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ================= GET PROJECTS ================= */
      .addCase(getAllProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(getAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= DOWNLOAD FILE ================= */
      .addCase(downloadProjectFile.fulfilled, (state, action) => {
        const { blob } = action.payload;

        // 🔽 Trigger download in browser
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", "file"); // you can improve filename

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
      })

      .addCase(downloadProjectFile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

/* =========================================================
   🔹 EXPORTS
========================================================= */
export const { setSelectedProject, clearSelectedProject } =
  projectSlice.actions;

export default projectSlice.reducer;