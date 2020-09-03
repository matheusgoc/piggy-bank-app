import { createSlice } from '@reduxjs/toolkit';

export const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    onboard: true,
    data: null,
  },
  reducers: {
    setOnboard: (state, action) => {
      state.onboard = action.payload;
    },
    setProfile: (state, action) => {
      state.data = action.payload;
    }
  },
});

//actions
export const { setOnboard, setProfile } = profileSlice.actions;

//selectors
export const getTerms = state => state.profile.terms;
export const getOnboard = state => state.profile.onboard;
export const getProfile = state => state.profile.data;

//reducers
export default profileSlice.reducer;
