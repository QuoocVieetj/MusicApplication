import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../config/apiConfig";

const initialState = {
  list: [],
  status: "idle",
  error: null,
};

export const fetchAlbums = createAsyncThunk("albums/fetch", async () => {
  const res = await fetch(`${API_BASE_URL}/api/albums`);
  return res.json();
});

export const addAlbum = createAsyncThunk("albums/add", async (album) => {
  const res = await fetch(`${API_BASE_URL}/api/albums`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(album),
  });
  return res.json();
});

export const updateAlbum = createAsyncThunk(
  "albums/update",
  async ({ id, data }) => {
    const res = await fetch(`${API_BASE_URL}/api/albums/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
);

export const deleteAlbum = createAsyncThunk("albums/delete", async (id) => {
  await fetch(`${API_BASE_URL}/api/albums/${id}`, { method: "DELETE" });
  return id;
});

const albumSlice = createSlice({
  name: "albums",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "success";
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

export default albumSlice.reducer;
export const albumReducer = albumSlice.reducer;
