import BaseService from './BaseService';
import CategoriesServiceApi from './CategoriesServiceApi';
import { store } from '../store';
import { getToken } from '../features/profile/ProfileSlice';
import { showLoading } from '../helpers';

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

      try {

        // loads for authentication
        if (token) {
          sync.setToken(token);
          await sync.loadCategories();
          SyncService.hasLoad = true;
        }

      } catch (error) {

        sync.handleHttpError(
          'SyncService.load: ',
          'Error on loading data from server',
          error
        );

      } finally {

        SyncService.isLoading = false;
        showLoading(false);
      }
    }
  }

  private async loadCategories() {
    try {

      const categoriesServiceApi = new CategoriesServiceApi();
      await categoriesServiceApi.load();
      categoriesServiceApi.store();

    } catch (error) {

      const method = 'SyncService.loadCategories';
      let msg = 'Unable to load categories';
      this.handleHttpError(method, msg, error);
    }
  }
}