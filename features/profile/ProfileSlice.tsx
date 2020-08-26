import { createSlice } from '@reduxjs/toolkit';

export const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    onboard: false,
  },
  reducers: {
    setOnboard: (state, action) => {
      state.onboard = action.payload;
    },
  },
});

//actions
export const { setOnboard } = profileSlice.actions;

//selectors
export const getTerms = state => state.profile.terms;
export const getOnboard = state => state.profile.onboard;

//reducers
export default profileSlice.reducer;
