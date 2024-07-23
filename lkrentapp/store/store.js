import { configureStore } from "@reduxjs/toolkit";
import loggedInReducer from "./loginSlice";
import locationReducer from "./locationSlice";
import timeReducer from "./timeSlice";
import registrationReducer from './registrationSlice';
import carListReducer from './carListSlice'
import promotionReducer from './promotionSlice';


const store = configureStore({
  reducer: {
    loggedIn: loggedInReducer,
    carsList:carListReducer,
    location: locationReducer,
    promotions: promotionReducer,
    time: timeReducer,
    registration: registrationReducer,
  },
});

export default store;
