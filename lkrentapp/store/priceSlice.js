import { createSlice } from '@reduxjs/toolkit';

export const priceSlice = createSlice({
  name: 'price',
  initialState: {
    selectedPromo: null,
    applicablePromotions: [],
  },
  reducers: {
    setSelectedPromo: (state, action) => {
      state.selectedPromo = action.payload;
    },
  },
});

export const { setSelectedPromo, addApplicablePromotion } = priceSlice.actions;

export default priceSlice.reducer;
