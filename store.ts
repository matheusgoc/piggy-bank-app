import { configureStore } from '@reduxjs/toolkit';
import termsReducer from './features/terms/TermsSlice';

export default configureStore({
  reducer: {
    terms: termsReducer,
  },
});
