import { configureStore } from "@reduxjs/toolkit";
import loggedInReducer from "./loginSlice";
import locationReducer from "./locationSlice";
import timeReducer from "./timeSlice";
import carReducer from "./carSlice"
import registrationReducer from './registrationSlice';


const store = configureStore({
  reducer: {
    loggedIn: loggedInReducer,
    cars: carReducer,
    location: locationReducer,
    time: timeReducer,
    registration: registrationReducer,
  },
});

export default store;
