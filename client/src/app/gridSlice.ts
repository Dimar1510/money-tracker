import { createSlice } from "@reduxjs/toolkit";

const initialState: Record<string, boolean> = {};

const gridSlice = createSlice({
  name: "grid",
  initialState,
  reducers: {
    toggleCard: (state, action) => {
      const cardName = action.payload;
      state[cardName] = !state[cardName];
    },
  },
  selectors: {
    selectGrid: (state) => state,
  },
});

export const gridReducer = gridSlice.reducer;
export const gridActions = gridSlice.actions;
export const { selectGrid } = gridSlice.selectors;
export default gridSlice.reducer;
