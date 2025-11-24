import { configureStore } from "@reduxjs/toolkit";
import { songReducer } from "../slice/songSlice";   // 👈 Sửa ở đây

export const store = configureStore({
  reducer: {
    songs: songReducer,  // 👈 OK
  },
});

export default store;

