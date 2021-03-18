import BankingService from './BankingService';
import { AxiosResponse } from 'axios';
import { InstitutionModel } from '../models/InstitutionModel';

export default class BankingServiceApi extends BankingService {
  constructor() {
    super()
  }

  /**
   * Load Institutions
   */
  async load(): Promise<InstitutionModel[]> {

    try {

      const res: AxiosResponse = await this.api.get('banking/institutions')

      const institutions = res.data.map((institution): InstitutionModel => {
        return BankingServiceApi.mapToStore(institution)
      })

      this.set(institutions)

      return institutions

    } catch (error) {

      const method = 'BankingServiceApi.load'
      const msg = 'Unable to load institutions'
      this.handleHttpError(method, msg, error, false)
    }
  }

  /**
   * Generates and retrieves a PlaidToken
   */
  async getLinkToken(): Promise<string> {

    try {

      const res: AxiosResponse = await this.api.get('banking/token/link')

      return res.data.link_token

    } catch(error) {

      const method = 'BankingServiceApi.getLinkToken'
      const msg = 'Unable to retrieve link token from the server'
      this.handleHttpError(method, msg, error, false)
    }
  }

  /**
   * Exchange a public token an create a new institution
   *
   * @param publicToken
   */
  async exchangePublicToken(publicToken: string): Promise<InstitutionModel> {

    try {

      const res: AxiosResponse = await this.api.post('banking/token/public', {
        'public_token': publicToken
      })

      const institution = BankingServiceApi.mapToStore(res.data)
      this.add(institution)

      return institution

    } catch(error) {

      const method = 'BankingServiceApi.exchangePublicToken'
      const msg = 'Unable to exchange public_token'
      this.handleHttpError(method, msg, error, false)
    }
  }

  /**
   * Format an institution data that comes from the API server
   *
   * @param institution
   */
  static mapToStore(institution): InstitutionModel {
    return {
      id: institution['id'],
      name: institution['name'],
      logo: institution['logo'],
    }
  }
}