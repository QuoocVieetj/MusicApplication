import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../supabaseClient";
import { API_BASE_URL } from "../../config/apiConfig";

const initialState = {
  user: null,
  session: null,
  loading: false,
  error: null,
};

/* ================= THUNKS ================= */

// Thunk cho Đăng nhập
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data; // Trả về { user, session }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk cho Đăng ký
export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      // 1) Tạo user trên Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
          },
        },
      });

      if (authError) throw authError;

      const user = authData.user;
      const session = authData.session;
      const accessToken = session?.access_token;

      // 2) Nếu đăng ký thành công và có session, lưu vào backend database
      if (user && accessToken) {
        const response = await fetch(`${API_BASE_URL}/api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId: user.id,
            displayName: name,
            email: email,
            avatarUrl: "",
            likedSongs: [],
            playlists: [],
            createdAt: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Không thể lưu thông tin người dùng vào server");
        }
      }

      return authData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk cho Đăng xuất
export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return null;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

/* ================= SLICE ================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Để cập nhật user từ session hiện tại nếu có (khi khởi động app)
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.session = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export const authReducer = authSlice.reducer;
export default authSlice.reducer;

