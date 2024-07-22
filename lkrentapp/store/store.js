import { configureStore } from "@reduxjs/toolkit";
import loggedInReducer from "./loginSlice";
import locationReducer from "./locationSlice";
import timeReducer from "./timeSlice";
import carReducer from "./carSlice"
import registrationReducer from './registrationSlice';
import carListReducer from './carListSlice'


const store = configureStore({
  reducer: {
    loggedIn: loggedInReducer,
    cars: carReducer,
    carsList:carListReducer,
    location: locationReducer,
    time: timeReducer,
    registration: registrationReducer,
  },
});

export default store;
