import BaseService from './BaseService';
import CategoriesServiceApi from './CategoriesServiceApi';
import { store } from '../store';
import { getToken } from '../features/profile/ProfileSlice';
import { showLoading } from '../helpers';
import TransactionsServiceApi from './TransactionsServiceApi';
import { setDeleteEnable } from '../features/transactions/TransactionsSlice';
import moment from 'moment';
import ProfileServiceApi from './ProfileServiceApi';

export default class SyncService extends BaseService{

  private static hasLoad = false;
  private static isLoading = false;
  public static async load(reload = false): Promise<void> {

    // force reload
    if (reload) {
      SyncService.hasLoad = false;
      SyncService.isLoading = false;
    }

    if (!SyncService.hasLoad && !SyncService.isLoading) {

      SyncService.isLoading = true;
      showLoading(true);

      const token = getToken(store.getState());
      const sync = new SyncService();
      sync.dispatch(setDeleteEnable(false));

      try {

        // loads only when authenticated
        if (token) {
          sync.setToken(token);
          await sync.loadCategories();
          await sync.loadTransactions();
          if (!reload) {
            await sync.loadProfile();
          }
          SyncService.hasLoad = true;
        }

      } catch (error) {

        const method = 'SyncService.load';
        const msg = 'Error on loading data from server';
        sync.handleHttpError(method, msg, error, false);

      } finally {

        SyncService.isLoading = false;
        showLoading(false);
      }
    }
  }

  private async loadProfile() {
    try {

      const api = new ProfileServiceApi();
      await api.load();
      api.store();

    } catch (error) {

      const method = 'SyncService.loadCategories';
      let msg = 'Unable to load categories';
      this.handleHttpError(method, msg, error, false);
    }
  }

  private async loadCategories() {
    try {

      const api = new CategoriesServiceApi();
      await api.load();
      api.store();

    } catch (error) {

      const method = 'SyncService.loadCategories';
      let msg = 'Unable to load categories';
      this.handleHttpError(method, msg, error, false);
    }
  }

  private async loadTransactions() {
    try {

      const api = new TransactionsServiceApi();
      if(!api.date) {
        api.setDate(moment().startOf('month').toDate());
      }
      await api.load();

    } catch (error) {

      const method = 'SyncService.loadTransactions';
      let msg = 'Unable to load transactions';
      this.handleHttpError(method, msg, error, false);
    }
  }
}