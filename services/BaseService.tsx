import axios, { AxiosInstance } from 'axios';
import { TOAST } from '../constants';

export interface IService {
  store(): void
  syncFromStore(): void
  get(): any,
  set(model: any): void,
}

export default class BaseService {

  public static BASE_UR = 'http://192.168.0.11:81/api/';
  protected static token: string;

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
      baseURL: BaseService.BASE_UR,
    });
    this.setResponseInteceptor();
    this.setToken();
  }

  setToken() {
    if (BaseService.token) {
      this.api.defaults.headers.common['Authorization'] = BaseService.token;
    } else if(this.api.defaults.headers.common['Authorization']) {
      delete(this.api.defaults.headers.common['Authorization']);
    }
  }

  setResponseInteceptor() {
    this.api.interceptors.response.use(function (response) {
      if (response.data['data']) {
        response.data = response.data['data'];
      }

      return response;
    });
  }

  handleHttpError(method, msg, error, hasErrorAlert = true) {
    console.warn(method + ' :' + error, error.toJSON());
    if (hasErrorAlert) {
      TOAST.ref.alertWithType('error', 'Error', msg);
      throw new Error(msg);
    }
  }
}