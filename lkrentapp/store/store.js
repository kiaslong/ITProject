import { configureStore } from '@reduxjs/toolkit';
import loggedInReducer from './loginSlice'; 
import locationReducer from './locationSlice';
import timeReducer from './timeSlice';

const store = configureStore({
  reducer: {
    loggedIn: loggedInReducer,
    location: locationReducer,
    time: timeReducer,
  },
});

export default store;
