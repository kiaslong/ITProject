import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';
import { getToken } from '../utils/tokenStorage';

export const fetchSearchingCars = createAsyncThunk(
  'cars/fetchSearchingCars',
  async (userId) => {
    const token = await getToken();
    const response = await api.get('/car/info-exclude-user', {
      params: { userId, type: 'searching' },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const fetchCarForYou = createAsyncThunk(
  'cars/fetchCarForYou',
  async (userId) => {
    const token = await getToken();
    const response = await api.get('/car/info-exclude-user', {
      params: { userId, type: 'carForYou' },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const fetchCarHistory = createAsyncThunk(
  'cars/fetchCarHistory',
  async (userId) => {
    const token = await getToken();
    const response = await api.get('/car/info-exclude-user', {
      params: { userId, type: 'carHistory' },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const fetchOwnerCars = createAsyncThunk(
  'cars/fetchOwnerCars',
  async (userId) => {
    const token = await getToken();
    const response = await api.get('/car/info-include-user', {
      params: { userId, type: 'ownerCars' },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

const carListSlice = createSlice({
  name: 'carsList',
  initialState: {
    searching: [],
    carForYou: [],
    carHistory: [],
    ownerCars: [],
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
    reloadSearchingCars: (state, action) => {
      // Trigger fetching action here
      state.searching = [];
    },
    reloadCarForYou: (state, action) => {
      // Trigger fetching action here
      state.carForYou = [];
    },
    reloadCarHistory: (state, action) => {
      // Trigger fetching action here
      state.carHistory = [];
    },
    reloadOwnerCars: (state, action) => {
      // Trigger fetching action here
      state.ownerCars = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSearchingCars.fulfilled, (state, action) => {
      state.searching = action.payload;
    });
    builder.addCase(fetchCarForYou.fulfilled, (state, action) => {
      state.carForYou = action.payload;
    });
    builder.addCase(fetchCarHistory.fulfilled, (state, action) => {
      state.carHistory = action.payload;
    });
    builder.addCase(fetchOwnerCars.fulfilled, (state, action) => {
      state.ownerCars = action.payload;
    });
  },
});

export const {
  setSearchingCars,
  setCarForYou,
  setCarHistory,
  setOwnerCars,
  reloadSearchingCars,
  reloadCarForYou,
  reloadCarHistory,
  reloadOwnerCars,
} = carListSlice.actions;

export default carListSlice.reducer;
