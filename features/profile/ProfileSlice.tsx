import { createSlice } from '@reduxjs/toolkit';

export const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    terms: false,
    onboard: false,
  },
  reducers: {
    toggleTerms: state => {
      state.terms = !state.terms;
    },
    setOnboardAsSeen: state => {
      state.onboard = true;
    },
  },
});

//actions
export const { toggleTerms, setOnboardAsSeen } = profileSlice.actions;

//selectors
export const getTerms = state => state.profile.terms;
export const getOnboard = state => state.profile.onboard;

//reducers
export default profileSlice.reducer;
