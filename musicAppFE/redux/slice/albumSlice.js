import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
            const res = await fetch("http://192.168.100.221:8386/api/albums");
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
                state.list = action.payload;
            })
            .addCase(fetchAlbums.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    }
});

export const albumReducer = albumSlice.reducer;

