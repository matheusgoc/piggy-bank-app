import { createSlice } from '@reduxjs/toolkit';

export const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    terms: false,
  },
  reducers: {
    toggleTerms: state => {
      state.terms = !state.terms;
    }
  },
});

//actions
export const { toggleTerms } = profileSlice.actions;

//selectors
export const getTerms = state => state.profile.terms;

//reducers
export default profileSlice.reducer;
