import { createSlice } from '@reduxjs/toolkit';

export const termsSlice = createSlice({
  name: 'terms',
  initialState: {
    value: false,
  },
  reducers: {
    toggleTerms: state => {
      state.value = !state.value;
    }
  },
});

export const { toggleTerms } = termsSlice.actions;

export const selectTerms = state => state.terms.value;

export default termsSlice.reducer;
