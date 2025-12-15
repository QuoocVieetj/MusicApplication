import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    list: [],
  },
  reducers: {
    toggleFavorite(state, action) {
      const song = action.payload;
      const exists = state.list.find((s) => s.id === song.id);

      if (exists) {
        state.list = state.list.filter((s) => s.id !== song.id);
      } else {
        state.list.push(song);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;

/* THUNK */
export const toggleFavoriteThunk = (song) => async (dispatch) => {
  dispatch(toggleFavorite(song));
};

export default favoritesSlice.reducer;
export const favoritesReducer = favoritesSlice.reducer;
