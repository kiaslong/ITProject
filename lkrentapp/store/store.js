import { configureStore } from "@reduxjs/toolkit";
import loggedInReducer from "./loginSlice";
import locationReducer from "./locationSlice";
import timeReducer from "./timeSlice";
import registrationReducer from './registrationSlice';
import carListReducer from './carListSlice'
import promotionReducer from './promotionSlice';
import priceReducer from "./priceSlice";
import messageReducer from "./messageSlice"
import carIdsReducer from "./carIdSlice"

const store = configureStore({
  reducer: {
    carIds:carIdsReducer,
    loggedIn: loggedInReducer,
    carsList:carListReducer,
    location: locationReducer,
    promotions: promotionReducer,
    time: timeReducer,
    registration: registrationReducer,
    price:priceReducer,
    message: messageReducer,
  },
});

export default store;
