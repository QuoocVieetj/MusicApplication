import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../config/apiConfig";

const initialState = {
  list: [],
  status: "idle",
  error: null,
};

/* ================= THUNKS ================= */

export const fetchUsers = createAsyncThunk("users/fetch", async () => {
  const res = await fetch(`${API_BASE_URL}/api/users`);
  return res.json();
});

export const addUser = createAsyncThunk("users/add", async (user) => {
  const res = await fetch(`${API_BASE_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return res.json();
});

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, data }) => {
    const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
);

export const deleteUser = createAsyncThunk("users/delete", async (id) => {
  await fetch(`${API_BASE_URL}/api/users/${id}`, { method: "DELETE" });
  return id;
});

/* ================= SLICE ================= */

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (s, a) => {
        s.list = a.payload;
        s.status = "success";
      })
      .addCase(addUser.fulfilled, (s, a) => {
        s.list.unshift(a.payload);
      })
      .addCase(updateUser.fulfilled, (s, a) => {
        const i = s.list.findIndex((u) => u.id === a.payload.id);
        if (i !== -1) s.list[i] = a.payload;
      })
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.list = s.list.filter((u) => u.id !== a.payload);
      });
  },
});

export default userSlice.reducer;
export const userReducer = userSlice.reducer;
