import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const NavigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    loading: false,
  },
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
});

//actions
export const { setLoading } = NavigationSlice.actions;

//selectors
export const isLoading = state => state.navigation.loading;

//reducer
export default NavigationSlice.reducer;
