import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../supabaseClient";

// Đăng nhập
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return rejectWithValue(error.message);
      }
      return data; // { user, session }
    } catch (err) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

// Đăng ký
export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password, displayName }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });
      if (error) {
        return rejectWithValue(error.message);
      }
      return data; // { user, session }
    } catch (err) {
      return rejectWithValue(err.message || "Register failed");
    }
  }
);

const initialState = {
  user: null,
  session: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutLocal: (state) => {
      state.user = null;
      state.session = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload?.user || null;
        state.session = action.payload?.session || null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload?.user || null;
        state.session = action.payload?.session || null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logoutLocal } = authSlice.actions;
export const authReducer = authSlice.reducer;

