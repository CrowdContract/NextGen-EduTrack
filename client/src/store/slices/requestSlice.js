import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// ================= GET ALL REQUESTS (Admin) =================
export const getAllRequests = createAsyncThunk(
  "request/getAllRequests",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/admin/requests");
      return res.data.data?.requests || [];
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch requests");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// ================= SLICE =================
const requestSlice = createSlice({
  name: "request",
  initialState: {
    list: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    clearSelected: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRequests.pending, (state) => { state.loading = true; })
      .addCase(getAllRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(getAllRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelected, clearSelected } = requestSlice.actions;
export default requestSlice.reducer;
