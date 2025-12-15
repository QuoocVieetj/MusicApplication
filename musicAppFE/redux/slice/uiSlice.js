import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    activeTab: "home",
  },
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = uiSlice.actions;

/* THUNK */
export const goToFavoriteTab = () => async (dispatch) => {
  dispatch(setActiveTab("heart"));
};

export const goToPlayTab = () => async (dispatch) => {
  dispatch(setActiveTab("play"));
};

export default uiSlice.reducer;
export const uiReducer = uiSlice.reducer;


