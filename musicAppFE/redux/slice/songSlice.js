import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../config/apiConfig";

// Chuẩn hóa dữ liệu bài hát từ API (snake_case -> camelCase, ưu tiên image/audio URL có sẵn)
const normalizeSong = (song) => {
    if (!song) return song;
    return {
        ...song,
        albumId: song.albumId || song.album_id || song.album_id_id || null,
        imageUrl:
            song.imageUrl ||
            song.image_url ||
            song.coverUrl ||
            song.cover_url ||
            null,
        audioUrl:
            song.audioUrl ||
            song.audio_url ||
            null,
        artistName:
            song.artistName ||
            song.artist_name ||
            song.artist ||
            "",
        genreName:
            song.genreName ||
            song.genre_name ||
            song.genre ||
            "",
        albumTitle:
            song.albumTitle ||
            song.album_title ||
            song.album ||
            "",
    };
};

const initialState = {
    list: [],
    status: "idle",
    error: null,
    searchQuery: "",
    searchResults: [],
    searchStatus: "idle",
    searchError: null,
};

// GET LIST SONGS
export const fetchSongs = createAsyncThunk(
    "songs/fetch",
    async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/songs`);
            if (!res.ok) {
                throw new Error(`Fetch songs failed: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            throw error;
        }
    }
);

// SEARCH SONGS - Tìm kiếm từ backend
export const searchSongs = createAsyncThunk(
    "songs/search",
    async (query) => {
        try {
            if (!query || query.trim() === "") {
                return [];
            }
            const res = await fetch(`${API_BASE_URL}/api/songs/search?q=${encodeURIComponent(query)}`);
            if (!res.ok) {
                throw new Error(`Search songs failed: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            throw error;
        }
    }
);

export const songSlice = createSlice({
    name: "songs",
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload || "";
        },
        clearSearchQuery: (state) => {
            state.searchQuery = "";
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch songs
            .addCase(fetchSongs.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchSongs.fulfilled, (state, action) => {
                state.status = "success";
                state.list = (action.payload || []).map(normalizeSong);
            })
            .addCase(fetchSongs.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // Search songs
            .addCase(searchSongs.pending, (state) => {
                state.searchStatus = "loading";
                state.searchError = null;
            })
            .addCase(searchSongs.fulfilled, (state, action) => {
                state.searchStatus = "success";
                state.searchResults = (action.payload || []).map(normalizeSong);
            })
            .addCase(searchSongs.rejected, (state, action) => {
                state.searchStatus = "failed";
                state.searchError = action.error.message;
                state.searchResults = [];
            });
    }
});

export const { setSearchQuery, clearSearchQuery } = songSlice.actions;
export const songReducer = songSlice.reducer;
