import { createSlice } from '@reduxjs/toolkit';

export const NavigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    loading: false,
  },
  reducers: {
    toggleLoading: (state) => {
      state.loading = !state.loading;
    },
  },
});

//actions
export const { toggleLoading } = NavigationSlice.actions;

//selectors
export const isLoading = state => state.navigation.loading;

//reducers
export default NavigationSlice.reducer;
