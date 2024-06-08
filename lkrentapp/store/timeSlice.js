import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  time: '21h00, 07/06 - 20h00, 08/06',
};

const timeSlice = createSlice({
  name: 'time',
  initialState,
  reducers: {
    setTime(state, action) {
      state.time = action.payload;
    },
  },
});

export const { setTime } = timeSlice.actions;

export default timeSlice.reducer;
