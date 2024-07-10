import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  loading: false,
  error: null,
  token: null, // Added token to the state
};

const loggedInSlice = createSlice({
  name: 'loggedIn',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;
      state.error = null;
      state.token = action.payload.token; // Save the token in the state
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.error = null;
      state.token = null; // Clear the token on logout
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } = loggedInSlice.actions;
export default loggedInSlice.reducer;
