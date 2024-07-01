import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  location: 'Đường Phan Đình Phùng, Phường 15, Q...',
  history: [],
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation(state, action) {
      state.location = action.payload;
    },
    addToHistory(state, action) {
      const location = action.payload;
      state.history = [location, ...state.history.filter(item => item !== location)];
    },
    clearHistory(state) {
      state.history = [];
    },
  },
});

export const { setLocation, addToHistory, clearHistory } = locationSlice.actions;

export default locationSlice.reducer;
