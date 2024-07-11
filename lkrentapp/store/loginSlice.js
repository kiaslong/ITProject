import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  loading: false,
  error: null,
  user: null, // Store user data instead of token
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
      state.user = action.payload.user; // Save the user data in the state
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.error = null;
      state.user = null; // Clear the user data on logout
    },
    updateUser: (state, action) => {
      state.user = action.payload; // Replace the user data with the new data
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout, updateUser  } = loggedInSlice.actions;
export default loggedInSlice.reducer;
