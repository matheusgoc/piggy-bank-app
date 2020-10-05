import { combineReducers } from "redux";
import AsyncStorage from '@react-native-community/async-storage';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import ProfileSlice from './features/profile/ProfileSlice';
import NavigationSlice from './features/navigation/NavigationSlice';
import TransactionsSlice from './features/transactions/TransactionsSlice';
import CategoriesSlice from './features/categories/CategoriesSlice';
import SyncService from './services/SyncService';

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
});

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  })
});

export const persistor = persistStore(store, null, () => {
  SyncService.load().catch(() => {
    console.log('Store Persistor: Server data has been loaded!');
  }).catch((error) => {
    const errorMsg = 'An error has occurred trying to load the data from server';
    console.warn('Store Persistor: ' + errorMsg + '(Error: ' + errorMsg + ')');
  });
});