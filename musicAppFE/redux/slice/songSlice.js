import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../config/apiConfig";

const initialState = {
  list: [],
  status: "idle",
  error: null,
  searchQuery: "",
};

// ================= FETCH =================
export const fetchSongs = createAsyncThunk("songs/fetch", async () => {
  const res = await fetch(`${API_BASE_URL}/api/songs`);
  if (!res.ok) throw new Error("Fetch failed");
  return await res.json();
});

// ================= ADD =================
export const addSong = createAsyncThunk("songs/add", async (song) => {
  const res = await fetch(`${API_BASE_URL}/api/songs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(song),
  });
  if (!res.ok) throw new Error("Add failed");
  return await res.json();
});

// ================= UPDATE =================
export const updateSong = createAsyncThunk(
  "songs/update",
  async ({ id, data }) => {
    const res = await fetch(`${API_BASE_URL}/api/songs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Update failed");
    return await res.json();
  }
);

// ================= DELETE =================
export const deleteSong = createAsyncThunk("songs/delete", async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/songs/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
  return id;
});

// ================= SLICE =================
const songSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSongs.fulfilled, (state, action) => {
        state.status = "success";
        state.list = action.payload;
      })
      .addCase(fetchSongs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addSong.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateSong.fulfilled, (state, action) => {
        const i = state.list.findIndex((s) => s.id === action.payload.id);
        if (i !== -1) state.list[i] = action.payload;
      })
      .addCase(deleteSong.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s.id !== action.payload);
      });
  },
});

export const { setSearchQuery } = songSlice.actions;
export const songReducer = songSlice.reducer;


