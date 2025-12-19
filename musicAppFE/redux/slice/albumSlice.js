import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../config/apiConfig";

const initialState = {
  list: [],
  selectedAlbum: null,
  status: "idle",
  error: null,
};

// ================= FETCH =================
export const fetchAlbums = createAsyncThunk("albums/fetch", async () => {
  const res = await fetch(`${API_BASE_URL}/api/albums`);
  if (!res.ok) throw new Error("Không thể tải danh sách album");
  return await res.json();
});

// ================= ADD =================
export const addAlbum = createAsyncThunk("albums/add", async (album) => {
  const res = await fetch(`${API_BASE_URL}/api/albums`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(album),
  });
  if (!res.ok) throw new Error("Thêm album thất bại");
  return await res.json();
});

// ================= UPDATE =================
export const updateAlbum = createAsyncThunk(
  "albums/update",
  async ({ id, data }) => {
    const res = await fetch(`${API_BASE_URL}/api/albums/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Cập nhật album thất bại");
    return await res.json();
  }
);

// ================= DELETE =================
export const deleteAlbum = createAsyncThunk("albums/delete", async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/albums/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Xóa album thất bại");
  return id;
});

// ================= SLICE =================
const albumSlice = createSlice({
  name: "albums",
  initialState,
  reducers: {
    selectAlbum: (state, action) => {
      state.selectedAlbum = action.payload;
    },
    clearSelectedAlbum: (state) => {
      state.selectedAlbum = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbums.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.status = "success";
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addAlbum.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateAlbum.fulfilled, (state, action) => {
        const i = state.list.findIndex(a => a.id === action.payload.id);
        if (i !== -1) state.list[i] = action.payload;
      })
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        state.list = state.list.filter(a => a.id !== action.payload);
      });
  },
});

export const { selectAlbum, clearSelectedAlbum } = albumSlice.actions;
export const albumReducer = albumSlice.reducer;
export default albumSlice.reducer;
