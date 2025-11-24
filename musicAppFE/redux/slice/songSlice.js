import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
    status: "idle",
    error: null,
};

// GET LIST SONGS
export const fetchSongs = createAsyncThunk(
    "songs/fetch",
    async () => {
        const res = await fetch("http://192.168.1.71:8386/api/songs");
        if (!res.ok) throw new Error("Fetch songs failed");
        return await res.json();
    }
);

export const songSlice = createSlice({
    name: "songs",
    initialState,
    reducers: {},
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
            });
    }
});

export const songReducer = songSlice.reducer;
