import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: null,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailuer: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutAction(state) {
      state.currentUser = null;
      state.error = null;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailuer,
  signOutAction,
  updateImage,
} = userSlice.actions;
export default userSlice.reducer;
