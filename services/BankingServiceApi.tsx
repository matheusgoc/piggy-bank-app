import BankingService from './BankingService';
import { AxiosResponse } from 'axios';
import { InstitutionModel } from '../models/InstitutionModel';
import { AccountModel } from '../models/AccountModel';
import { BankingTransactionModel } from '../models/BankingTransactionModel';

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
      const msg = "Unable to retrieve the institution's accounts"
      this.handleHttpError(method, msg, error, false)
    }
  }

  /**
   * Retrieve the banking transactions from provided accounts on a determined period and range
   *
   * @param institution: InstitutionModel
   * @param start - Start Date on YYYY-MM-DD ISO format
   * @param end - End Date on YYYY-MM-DD ISO format
   * @param accounts - accounts ids separated by coma ","
   * @param page - current page for pagination beginning from 0
   */
  async getTransactions(
    institution: InstitutionModel,
    start: string, end: string,
    accounts: string,
    page: number,
  ): Promise<BankingTransactionModel[]> {
    try {

      const count = 20
      const offset = (page - 1) * count
      const url = `banking/institutions/${institution.id}/transactions/${start}/${end}/`
      const res: AxiosResponse = await this.api.get(url, {params: {accounts,count,offset}})
      return res.data.map((data) => BankingServiceApi.mapTransactionToStore(data))

    } catch (error) {

      const method = 'BankingServiceApi.getTransactions'
      const msg = "Unable to retrieve the institution's transactions"
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

  static mapTransactionToStore(data): BankingTransactionModel {
    return {
      id: data['transaction_id'],
      amount: data['amount'],
      isPending: data['pending'],
      channel: data['payment_channel'],
      name: data['name'],
      merchantName: data['merchant_name'],
      date: data['date'],
      categories: data['category'],
      currency: data['iso_currency_code'] ?? data['unofficial_currency_code'],
      location: {
        address: data['location']['address'],
        city: data['location']['city'],
        region: data['location']['region'],
        postalCode: data['location']['postal_code'],
        country: data['location']['country'],
        lat: data['location']['lat'],
        lon: data['location']['lon'],
        storeNumber: data['location']['store_number']
      }
    }
  }
}