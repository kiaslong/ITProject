import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiKey = process.env.GOONG_KEY_3;

const extractStreetName = (address) => {
  const regex = /(?:\d+\sHẻm\s\d+\s)?(.+)/; // Regex to match and extract the street name part
  const match = address.match(regex);

  if (match) {
    return `Đường ${match[1]}`; // Return the street name part
  }

  return address;
};

export const fetchInitialLocation = createAsyncThunk(
  'location/fetchInitialLocation',
  async (_, { rejectWithValue }) => {
    try {
      const cachedLocation = await AsyncStorage.getItem('cachedLocation');
      if (cachedLocation) {
        return JSON.parse(cachedLocation);
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
        maximumAge: 10000,
        timeout: 5000,
      });

      const { latitude, longitude } = location.coords;
      const url = `https://rsapi.goong.io/Geocode?latlng=${latitude},${longitude}&api_key=${apiKey}`;
      const response = await axios.get(url);

      if (response.data.results.length > 0) {
        const formattedAddress = response.data.results[0].formatted_address;
        const streetName = extractStreetName(formattedAddress);
        
        // Cache the location
        await AsyncStorage.setItem('cachedLocation', JSON.stringify(streetName));
        
        return streetName;
      } else {
        throw new Error('Address not found');
      }
    } catch (error) {
      console.error('Error fetching initial location:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  location: 'Đang xác định vị trí...', // Placeholder or empty string
  history: [],
  loading: false,
  error: null,
  selectedAddressType: 'custom',
  deliveryLocation: null, // New state for delivery location
  deliveryPrice: 0, // New state for delivery price
  isConfirmed: false,
  pickupMethod: 'self',
  carLocation: null,
    userLocation: null,  // New state for confirmation
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation(state, action) {
      state.location = action.payload;
    },
    setDeliveryLocation(state, action) {
      state.deliveryLocation = action.payload;
    },
    addToHistory(state, action) {
      const location = action.payload;
      state.history = [location, ...state.history.filter((item) => item !== location)];
    },
    clearHistory(state) {
      state.history = [];
    },
    setSelectedAddressType(state, action) {
      state.selectedAddressType = action.payload;
    },
    setDeliveryPrice(state, action) {
      state.deliveryPrice = action.payload;
    },
    setIsConfirmed(state, action) { // New reducer to set confirmation state
      state.isConfirmed = action.payload;
    },
    setPickupMethod: (state, action) => { // Add this reducer
      state.pickupMethod = action.payload;
    },
    setCarLocation: (state, action) => {
      state.carLocation = action.payload;
    },
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInitialLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.location = action.payload;
      })
      .addCase(fetchInitialLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLocation, setDeliveryLocation, addToHistory, clearHistory, setSelectedAddressType, setDeliveryPrice, setIsConfirmed ,  setCarLocation,
  setUserLocation ,setPickupMethod} = locationSlice.actions;

export default locationSlice.reducer;
