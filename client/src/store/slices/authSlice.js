import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// ================= LOGIN =================
export const login = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/login", data, {
        withCredentials: true,
      });

      toast.success(res.data.message);
      return res.data.user;

    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed";

      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ================= FORGOT PASSWORD =================
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        "/auth/password/forgot-password",
        { email },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      return res.data;

    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to send reset link";

      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ================= RESET PASSWORD =================
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(
        `/auth/password/reset/${token}`,
        {
          password,
          confirmPassword: password,
        },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      return res.data;

    } catch (error) {
      const message =
        error.response?.data?.message || "Reset failed";

      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ================= GET USER =================
export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/auth/me", {
        withCredentials: true,
      });

      return res.data.user;

    } catch (error) {
      return thunkAPI.rejectWithValue(null);
    }
  }
);

// ================= LOGOUT =================
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/auth/logout", {
        withCredentials: true,
      });

      toast.success(res.data.message || "Logged out successfully");
      return res.data;

    } catch (error) {
      const message =
        error.response?.data?.message || "Logout failed";

      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ================= SLICE =================
const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isLoggingIn: false,
    isRequestingForToken: false,
    isUpdatingPassword: false,
    isCheckingAuth: false,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      // ===== LOGIN =====
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.authUser = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })

      // ===== FORGOT PASSWORD =====
      .addCase(forgotPassword.pending, (state) => {
        state.isRequestingForToken = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isRequestingForToken = false;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.isRequestingForToken = false;
      })

      // ===== RESET PASSWORD =====
      .addCase(resetPassword.pending, (state) => {
        state.isUpdatingPassword = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isUpdatingPassword = false;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.isUpdatingPassword = false;
      })

      // ===== GET USER =====
      .addCase(getUser.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.authUser = action.payload;
      })
      .addCase(getUser.rejected, (state) => {
        state.isCheckingAuth = false;
        state.authUser = null;
      })

      // ===== LOGOUT =====
      .addCase(logout.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isCheckingAuth = false;
        state.authUser = null;
      })
      .addCase(logout.rejected, (state) => {
        state.isCheckingAuth = false;
      });
  },
});

// ================= EXPORT =================
export default authSlice.reducer;