// src/store/carSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api'; // Make sure to update the import path to your axios instance
import { getToken } from '../utils/tokenStorage';

const initialState = {
  cars: [],
  status: 'idle',
  error: null,
};

export const fetchCarsExcludingUser = createAsyncThunk(
  'cars/fetchCarsExcludingUser',
  async (userId) => {
    const response = await api.get(`/car/info-exclude-user?userId=${userId}`,{
        headers: {
          Authorization: await getToken(),
        },
      });
    return response.data;
  }
);

const carSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCarsExcludingUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCarsExcludingUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cars = action.payload;
      })
      .addCase(fetchCarsExcludingUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default carSlice.reducer;
