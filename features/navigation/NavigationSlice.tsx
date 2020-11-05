import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ACTIONS } from '../../constants';

export const NavigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    loading: false,
    action: null,
  },
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAction: (state, action: PayloadAction<ACTIONS>) => {
      state.action = action.payload;
    }
  },
});

//actions
export const { setLoading, setAction } = NavigationSlice.actions;

//selectors
export const isLoading = state => state.navigation.loading;
export const getAction = state => state.navigation.action;

//reducer
export default NavigationSlice.reducer;
