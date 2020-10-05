import { persistStore } from "redux-persist";
import SyncService from './services/SyncService';
import { store } from './store';

export const persistor = persistStore(store, null, () => {
  SyncService.load().then(() => {
    console.log('Store Persistor: Server data has been loaded!');
  }).catch(() => {
    console.warn('Store Persistor: An error has occurred trying to load the data from server');
  });
});