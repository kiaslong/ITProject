// src/store/promotionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';
import { getToken, getAdminToken } from '../utils/tokenStorage';

const TIMEOUT_DURATION = 3000; // 10 seconds timeout

// Utility function to create a timeout promise
const timeout = (ms) => new Promise((_, reject) => 
  setTimeout(() => reject(new Error('Request timed out')), ms)
);

// Thunk to fetch promotions with user token or admin token as fallback
export const getPromotions = createAsyncThunk('promotions/getPromotions', async (_, { rejectWithValue }) => {
  try {
    const token = await getToken();
    const adminToken = await getAdminToken();

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else if (adminToken) {
      headers['Authorization'] = `Bearer ${adminToken}`;
    } else {
      console.error('No token available');
      throw new Error('No token available');
    }

    // Race the API call against the timeout
    const response = await Promise.race([
      api.get('/promotion', { headers }),
      timeout(TIMEOUT_DURATION)
    ]);

    return response.data;
  } catch (error) {
    console.error('Failed to fetch promotions:', error);
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

const promotionSlice = createSlice({
  name: 'promotions',
  initialState: {
    promotions: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPromotions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPromotions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.promotions = action.payload;
      })
      .addCase(getPromotions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.error('Failed to update promotions state:', state.error);
      });
  },
});

export default promotionSlice.reducer;
