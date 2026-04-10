import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const getNotifications = createAsyncThunk(
  "notifications/getNotifications",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/notification");
      return res.data?.data || res.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch notifications"
      );
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// ================= MARK AS READ =================
export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.put(`/notification/${id}/read`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// ================= MARK ALL AS READ =================
export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.put(`/notification/read-all`);
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// ================= DELETE =================
export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/notification/${id}/delete`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);
const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    list: [],
    unreadCount: 0,
    readCount: 0,
    highPriorityMessages: 0,
    thisWeekNotifications: 0,
    loading: false,
    error: null,
  },
  reducers: {},
extraReducers: (builder) => {
    builder

      // ================= GET =================
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.list = action.payload?.notifications || [];
        state.unreadCount = action.payload?.unreadOnly || 0;
        state.readCount = action.payload?.readOnly || 0;
        state.highPriorityMessages =
          action.payload?.highPriorityMessages || 0;
        state.thisWeekNotifications =
          action.payload?.thisWeekNotifications || 0;
      })

      // ================= MARK ONE =================
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.list = state.list.map((n) =>
          n._id === action.payload ? { ...n, isRead: true } : n
        );

        state.unreadCount = Math.max(0, state.unreadCount - 1);
        state.readCount = Math.max(0, state.readCount + 1);
      })

      // ================= MARK ALL =================
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.list = state.list.map((n) => ({
          ...n,
          isRead: true,
        }));

        state.unreadCount = 0;
      })

      // ================= DELETE =================
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const removed = state.list.find(
          (n) => n._id === action.payload
        );

        state.list = state.list.filter(
          (n) => n._id !== action.payload
        );

        if (removed) {
          if (!removed.isRead) {
            state.unreadCount = Math.max(
              0,
              state.unreadCount - 1
            );
          }

          if (removed.isRead) {
            state.readCount = Math.max(
              0,
              state.readCount - 1
            );
          }

          if (removed.priority === "high") {
            state.highPriorityMessages = Math.max(
              0,
              state.highPriorityMessages - 1
            );
          }
        }
      })

      // ================= MATCHERS =================
      .addMatcher(
        (action) =>
          action.type.startsWith("notifications/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addMatcher(
        (action) =>
          action.type.startsWith("notifications/") &&
          action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )

      .addMatcher(
        (action) =>
          action.type.startsWith("notifications/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },});

export default notificationSlice.reducer;
