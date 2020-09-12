import { createSlice } from '@reduxjs/toolkit';

export const ProfileSlice = createSlice({
  name: 'profile',
  initialState: {
    onboard: true,
    data: null,
    token: null,
  },
  reducers: {
    setOnboard: (state, action) => {
      state.onboard = action.payload;
    },
    setProfile: (state, action) => {
      state.data = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    }
  },
});

//actions
export const { setOnboard, setProfile, setToken } = ProfileSlice.actions;

//selectors
export const getProfile = state => state.profile.data;
export const getToken = state => state.profile.token;
export const hasToken = state => !!state.profile.token;
export const hasOnboard = state => state.profile.onboard;

//reducers
export default ProfileSlice.reducer;
