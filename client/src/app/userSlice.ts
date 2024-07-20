import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "../app/services/userApi";
import { User } from "./types";

interface InitialState {
  isAuthenticated: boolean;
  token?: string;
  current?: User;
}

const initialState: InitialState = { isAuthenticated: false };

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: () => initialState,
  },
  selectors: {
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectCurrent: (state) => state.current,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(userApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token;
      })
      .addMatcher(userApi.endpoints.current.matchFulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.current = action.payload;
      });
  },
});

export const { logout } = slice.actions;
export const { selectIsAuthenticated, selectCurrent } = slice.selectors;
export default slice.reducer;
