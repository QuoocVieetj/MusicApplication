import { configureStore } from "@reduxjs/toolkit";
import { songReducer } from "../slice/songSlice";
import { albumReducer } from "../slice/albumSlice";
import { favoritesReducer } from "../slice/favoritesSlice";
import { uiReducer } from "../slice/uiSlice";
import {userReducer} from "../slice/userSlice";


export const store = configureStore({
  reducer: {
    songs: songReducer,
    albums: albumReducer,
    favorites: favoritesReducer,
    ui: uiReducer,
    users: userReducer,
  },
});

export default store;

