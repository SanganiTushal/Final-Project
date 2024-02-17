import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentListing: null,
  searchListing: [],
};

const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    selectListing: (state, action) => {
      state.currentListing = action.payload;
    },
    searchListing: (state, action) => {
      state.searchListing = action.payload;
    },
  },
});

export const { selectListing, searchListing } = listSlice.actions;
export default listSlice.reducer;
