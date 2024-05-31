import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    loading: false,
    error: null,
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
      },
      loginFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
      logout: (state) => {
        state.isLoggedIn = false;
        state.error = null;
      },
    },

  });  

  export const { loginRequest, loginSuccess, loginFailure, logout } = loggedInSlice.actions;
  export default loggedInSlice.reducer;