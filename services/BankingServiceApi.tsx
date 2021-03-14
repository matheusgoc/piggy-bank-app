import BankingService from './BankingService';
import { AxiosResponse } from 'axios';

export default class BankingServiceApi extends BankingService {
  constructor() {
    super();
  }

  async getLinkToken() {

    try {

      const res: AxiosResponse = await this.api.get('banking/token/link');

      return res.data.link_token;

    } catch(error) {

      const method = 'BankingServiceApi.getLinkToken';
      const msg = 'Unable to retrieve link token from the server';
      this.handleHttpError(method, msg, error, false);
    }
  }
}