import axios, { AxiosInstance } from 'axios';
import { API_URL, HTTP_STATUS, TOAST } from '../constants';
import { store } from '../store';
import { RootNavigation } from '../helpers';
import { clearProfile } from '../features/profile/ProfileSlice';
import { clearTransactions } from '../features/transactions/TransactionsSlice';
import { clearReports } from '../features/reports/ReportsSlice';
import { clearCategories } from '../features/categories/CategoriesSlice';

export interface IService {
  store(): void
  syncFromStore(): void
  get(): any,
  set(model: any): void,
}

export default class BaseService {

  public static BASE_URL = API_URL;
  public static token: string;

  protected api:AxiosInstance;

  constructor() {
    this.setApi();
  }

  /**
   * Set up the axios to request the API web service
   * @private
   */
  private setApi() {
    this.api = axios.create({
      baseURL: BaseService.BASE_URL,
    });
    this.setResponseInterceptor();
    this.setRequestInterceptor();
  }

  setToken(token: string) {

    BaseService.token = token;
  }

  getToken() {

    return BaseService.token;
  }

  private setResponseInterceptor() {
    this.api.interceptors.response.use(function (response) {

      if (response.data['data']) {
        response.data = response.data['data'];
      }

      return response;
    });
  }

  private setRequestInterceptor() {
    this.api.interceptors.request.use(function (request){

      request.headers['Content-Type'] = 'application/json';
      request.headers['Accept'] = 'application/json'

      if (BaseService.token) {
        request.headers['Authorization'] = 'Bearer ' + BaseService.token;
      } else if (request.headers['Authorization']) {
        delete(request.headers['Authorization']);
      }

      return request;
    });
  }

  handleHttpError(method, msg, error, hasErrorAlert = true) {

    const errorJSON = (error.toJSON && typeof(error.toJSON) === 'function')? error.toJSON() : null;

    // cast token has expired or revoked
    if (error.response?.status == HTTP_STATUS.UNAUTHORIZED) {

      // go back to SignIn view
      this.signOut(false).then(() => {
        TOAST.ref.alertWithType(
          'error',
          'Your access has expired or revoked',
          'Sign in again',
          null,
          8000,
        );
        RootNavigation.reset('SignIn');
      });

    } else if (hasErrorAlert) {

      TOAST.ref.alertWithType('error', 'Error', msg);
    }

    console.warn(method + ': ' + error, errorJSON );
    throw new Error(msg);
  }

  dispatch(action) {
    store.dispatch(action);
  }

  getState() {
    return store.getState();
  }

  /**
   * Revoke the user's access token and
   * clear states and storage data
   * to log the user out
   */
  async signOut(revoke=true):Promise<void> {
    try {

      if (revoke) {
        // revoke the current token
        await this.api.get('profile/revoke');
      }

      // reset token and profile
      this.setToken(null);
      this.dispatch(clearProfile());

      // reset transaction
      this.dispatch(clearTransactions());

      // reset reports
      this.dispatch(clearReports());

      // reset categories
      this.dispatch(clearCategories());

    } catch (error) {

      const method = 'ProfileServiceApi.signOut';
      const msg = 'The logout has fail';
      this.handleHttpError(method, msg, error);
    }
  }
}