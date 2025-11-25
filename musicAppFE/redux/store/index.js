import { configureStore } from "@reduxjs/toolkit";
import { songReducer } from "../slice/songSlice";
import { albumReducer } from "../slice/albumSlice";

export const store = configureStore({
  reducer: {
    songs: songReducer,
    albums: albumReducer,
  },
});

export default store;

