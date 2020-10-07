import axios, { AxiosInstance } from 'axios';
import { TOAST } from '../constants';
import { store } from '../store';

// @ts-ignore
import { API_URL } from '@env';

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
    console.warn(method + ': ' + error, errorJSON );
    if (hasErrorAlert) {
      TOAST.ref.alertWithType('error', 'Error', msg);
      throw new Error(msg);
    }
  }

  dispatch(action) {
    store.dispatch(action);
  }

  getState() {
    return store.getState();
  }
}