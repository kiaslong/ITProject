import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';
import { getAdminToken, getToken } from '../utils/tokenStorage';

const TIMEOUT_DURATION = 3000; // 10 seconds timeout

// Utility function to create a timeout promise
const timeout = (ms) => new Promise((_, reject) => 
  setTimeout(() => reject(new Error('Request timed out')), ms)
);

export const fetchSearchingCars = createAsyncThunk(
  'cars/fetchSearchingCars',
  async ({ userId, carIds }, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const adminToken = await getAdminToken();

      let response;

      if (userId) {
        response = await Promise.race([
          api.get('/car/info-exclude-user', {
            params: { userId, excludeCarIds: carIds.join(','), type: 'carForYou' },
            headers: { Authorization: `Bearer ${token}` },
          }),
          timeout(TIMEOUT_DURATION)
        ]);
      } else {
        response = await Promise.race([
          api.get('/car/info-verified', {
            headers: { Authorization: `Bearer ${adminToken}` },
          }),
          timeout(TIMEOUT_DURATION)
        ]);
      }

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCarForYou = createAsyncThunk(
  'cars/fetchCarForYou',
  async ({ userId, carIds }, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const adminToken = await getAdminToken();

      let response;

      if (userId) {
        response = await Promise.race([
          api.get('/car/info-exclude-user', {
            params: { userId, excludeCarIds: carIds.join(','), type: 'carForYou' },
            headers: { Authorization: `Bearer ${token}` },
          }),
          timeout(TIMEOUT_DURATION)
        ]);
      } else {
        response = await Promise.race([
          api.get('/car/info-verified', {
            headers: { Authorization: `Bearer ${adminToken}` },
          }),
          timeout(TIMEOUT_DURATION)
        ]);
      }

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCarHistory = createAsyncThunk(
  'cars/fetchCarHistory',
  async ({ userId, carIds }, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const response = await Promise.race([
        api.get('/car/info-exclude-user', {
          params: { userId, excludeCarIds: carIds.join(','), type: 'carHistory' },
          headers: { Authorization: `Bearer ${token}` },
        }),
        timeout(TIMEOUT_DURATION)
      ]);

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchOwnerCars = createAsyncThunk(
  'cars/fetchOwnerCars',
  async (userId, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const response = await Promise.race([
        api.get('/car/info-include-user', {
          params: { userId, type: 'ownerCars' },
          headers: { Authorization: `Bearer ${token}` },
        }),
        timeout(TIMEOUT_DURATION)
      ]);

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const carListSlice = createSlice({
  name: 'carsList',
  initialState: {
    searching: [],
    carForYou: [],
    carHistory: [],
    ownerCars: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setSearchingCars: (state, action) => {
      state.searching = action.payload;
    },
    setCarForYou: (state, action) => {
      state.carForYou = action.payload;
    },
    setCarHistory: (state, action) => {
      state.carHistory = action.payload;
    },
    setOwnerCars: (state, action) => {
      state.ownerCars = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchingCars.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSearchingCars.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searching = action.payload;
      })
      .addCase(fetchSearchingCars.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchCarForYou.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCarForYou.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.carForYou = action.payload;
      })
      .addCase(fetchCarForYou.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchCarHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCarHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.carHistory = action.payload;
      })
      .addCase(fetchCarHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchOwnerCars.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOwnerCars.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ownerCars = action.payload;
      })
      .addCase(fetchOwnerCars.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  setSearchingCars,
  setCarForYou,
  setCarHistory,
  setOwnerCars,
} = carListSlice.actions;

export default carListSlice.reducer;
