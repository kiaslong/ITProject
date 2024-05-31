import { configureStore } from '@reduxjs/toolkit';
import loggedInReducer from './loginSlice'; 

const store = configureStore({
  reducer: {
    loggedIn: loggedInReducer,
  },
});

export default store;
