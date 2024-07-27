import { createSlice } from '@reduxjs/toolkit';

const carIdsSlice = createSlice({
  name: 'carIds',
  initialState: {
    carIds: [],
  },
  reducers: {
    setCarIds: (state, action) => {
      state.carIds = action.payload;
    },
    clearCarIds: (state) => {
      state.carIds = [];
    },
  },
});

export const { setCarIds, clearCarIds } = carIdsSlice.actions;
export default carIdsSlice.reducer;
