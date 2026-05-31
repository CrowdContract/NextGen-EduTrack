import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// ================= CREATE DEADLINE =================
export const createDeadline = createAsyncThunk(
  "deadline/createDeadline",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/deadline/create-deadline/${id}`, data);
      toast.success(res.data.message || "Deadline updated");
      return res.data.data?.deadline || res.data.data || res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create deadline");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// ================= GET DEADLINES =================
export const getDeadlines = createAsyncThunk(
  "deadline/getDeadlines",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/deadline");
      return res.data.data?.deadlines || res.data.data || [];
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch deadlines");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// ================= DELETE DEADLINE =================
export const deleteDeadline = createAsyncThunk(
  "deadline/deleteDeadline",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/deadline/${id}`);
      toast.success("Deadline deleted");
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete deadline");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// ================= SLICE =================
const deadlineSlice = createSlice({
  name: "deadline",
  initialState: {
    deadlines: [],
    nearby: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createDeadline.pending, (state) => { state.loading = true; })
      .addCase(createDeadline.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.deadlines.push(action.payload);
      })
      .addCase(createDeadline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get
      .addCase(getDeadlines.pending, (state) => { state.loading = true; })
      .addCase(getDeadlines.fulfilled, (state, action) => {
        state.loading = false;
        state.deadlines = action.payload || [];
      })
      .addCase(getDeadlines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteDeadline.fulfilled, (state, action) => {
        state.deadlines = state.deadlines.filter((d) => d._id !== action.payload);
      });
  },
});

export default deadlineSlice.reducer;
