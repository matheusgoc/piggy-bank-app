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
        return BankingServiceApi.mapInstitutionToStore(institution)
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

      const institution = BankingServiceApi.mapInstitutionToStore(res.data)
      this.add(institution)

      return institution

    } catch(error) {

      const method = 'BankingServiceApi.exchangePublicToken'
      const msg = 'Unable to exchange public_token'
      this.handleHttpError(method, msg, error, false)
    }
  }

  /**
   * Delete an institution from the server and remove it from the device's storage
   *
   * @param institution
   * @param index
   */
  async delete(institution: InstitutionModel, index): Promise<void> {

    try {

      await this.api.delete('banking/institutions/' + institution.id)
      this.remove(index);

    } catch (error) {

      const method = 'BankingServiceApi.deleteInstitution'
      const msg = 'Unable to remove an institution'
      this.handleHttpError(method, msg, error, false)
    }
  }

  /**
   * Retrieve an institution's accounts
   *
   * @param institution
   */
  async getAccounts(institution: InstitutionModel): Promise<AccountModel[]> {

    try {

      const res: AxiosResponse = await this.api.get('banking/institutions/' + institution.id + '/accounts')
      return res.data.map((data) => BankingServiceApi.mapAccountToStore(data))

    } catch (error) {

      const method = 'BankingServiceApi.getAccounts'
      const msg = 'Unable to retrieve the institution accounts'
      this.handleHttpError(method, msg, error, false)
    }
  }

  /**
   * Format an institution data that comes from the API server
   *
   * @param data
   */
  static mapInstitutionToStore(data): InstitutionModel {
    return {
      id: data['id'],
      name: data['name'],
      logo: data['logo'],
    }
  }

  /**
   * Format an institution account data that comes from the API server
   *
   * @param data
   */
  static mapAccountToStore(data): AccountModel {
    return {
      id: data['account_id'],
      mask: data['mask'],
      name: data['name'],
      officialName: data['official_name'],
      type: data['type'],
      subtype: data['subtype'],
      checked: false,
    }
  }
}