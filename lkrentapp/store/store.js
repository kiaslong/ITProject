import { configureStore } from "@reduxjs/toolkit";
import loggedInReducer from "./loginSlice";
import locationReducer from "./locationSlice";
import timeReducer from "./timeSlice";
import registrationReducer from './registrationSlice';
import carListReducer from './carListSlice'


const store = configureStore({
  reducer: {
    loggedIn: loggedInReducer,
    carsList:carListReducer,
    location: locationReducer,
    time: timeReducer,
    registration: registrationReducer,
  },
});

export default store;
