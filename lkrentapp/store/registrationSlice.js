// store/registrationSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  licensePlate: '',
  description: '',
  selectedFeatures: [],
  selectedYear: '',
  selectedSeats: '',
  selectedMake: '',
  selectedModel: '',
  transmission: 'Automatic',
  fuel: 'Gasoline',
  promotion: 'Có',
  images: { avatar: null, front: null, back: null, left: null, right: null },
  documents: { registration: null },
  price: 500,
  discount: false,
  discountPercentage: 20,
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setImages: (state, action) => {
      state.images = { ...state.images, ...action.payload };
    },
    setDocuments: (state, action) => {
      state.documents = { ...state.documents, ...action.payload };
    },
    resetRegistration: () => initialState,
  },
});

export const { setField, setImages, setDocuments, resetRegistration } = registrationSlice.actions;

export default registrationSlice.reducer;
