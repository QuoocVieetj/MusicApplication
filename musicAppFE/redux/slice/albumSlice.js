import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../config/apiConfig";

// Chuẩn hóa dữ liệu album từ API (snake_case -> camelCase, map cover_url)
const normalizeAlbum = (album) => {
    if (!album) return album;
    return {
        ...album,
        coverUrl:
            album.coverUrl ||
            album.cover_url ||
            album.image_url ||
            null,
        title: album.title || "",
        artistId: album.artist_id || album.artistId || "",
        genres: album.genres || [], // fallback nếu backend chưa trả genres
    };
};

const initialState = {
    list: [],
    status: "idle",
    error: null,
};

// GET LIST ALBUMS
export const fetchAlbums = createAsyncThunk(
    "albums/fetch",
    async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/albums`);
            if (!res.ok) {
                throw new Error(`Fetch albums failed: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            throw error;
        }
    }
);

export const albumSlice = createSlice({
    name: "albums",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAlbums.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAlbums.fulfilled, (state, action) => {
                state.status = "success";
                state.list = (action.payload || []).map(normalizeAlbum);
            })
            .addCase(fetchAlbums.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    }
});

export const albumReducer = albumSlice.reducer;

