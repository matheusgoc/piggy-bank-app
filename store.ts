import { combineReducers } from "redux";
import AsyncStorage from '@react-native-community/async-storage';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import ProfileSlice from './features/profile/ProfileSlice';
import NavigationSlice from './features/navigation/NavigationSlice';
import TransactionsSlice from './features/transactions/TransactionsSlice';
import CategoriesSlice from './features/categories/CategoriesSlice';
import ReportsSlice from './features/reports/ReportsSlice';
import BankingSlice from './features/banking/BankingSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['navigation'],
}

const rootReducer = combineReducers({
  navigation: NavigationSlice,
  profile: ProfileSlice,
  categories: CategoriesSlice,
  transactions: TransactionsSlice,
  reports: ReportsSlice,
  banking: BankingSlice,
});

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: false,
  })
});