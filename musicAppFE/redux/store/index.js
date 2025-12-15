import { configureStore } from "@reduxjs/toolkit";
import { songReducer } from "../slice/songSlice";
import { albumReducer } from "../slice/albumSlice";
import { authReducer } from "../slice/authSlice";

export const store = configureStore({
  reducer: {
    songs: songReducer,
    albums: albumReducer,
    auth: authReducer,
  },
});

export default store;

