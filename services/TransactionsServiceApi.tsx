import { AxiosRequestConfig, AxiosResponse } from 'axios';
import FormData from 'form-data';
import moment from 'moment';
import TransactionsService from './TransactionsService';
import { TransactionModel } from '../models/TransactionModel';

/**
 * TransactionsServiceApi
 * A service to handle the transaction's persistence at the API web service
 *
 * @extends TransactionsService
 */
export default class TransactionsServiceApi extends TransactionsService {

  constructor() {
    super();
  }

  /**
   * Load the list of transactions
   *
   * @param year
   * @param month
   * @param limit
   */
  async load(year?, month?, limit?):Promise<TransactionModel[]> {

    try {

      if (!year) {
        year = moment(this.date).format('YYYY');
      }

      if (!month) {
        month = moment(this.date).format('MM');
      }

      let url = 'transactions/' + year + '/' + month;
      if (limit) {
        url += '/' + limit;
      }
      const res: AxiosResponse = await this.api.get(url);
      const list = res.data.map((item): TransactionModel => {
        return this.mapToStore(item);
      });
      this.set(list);

      return this.list;

    } catch(error) {

      const method = 'TransactionsServiceApi.load';
      const msg = 'Unable to retrieve transactions from the server';
      this.handleHttpError(method, msg, error);
    }
  }

  /**
   * Persist a transaction on the server
   *
   * @param transaction: TransactionModel last transaction added or updated
   * @param showError[optional] default: true
   */
  async save(transaction: TransactionModel, showError = true):Promise<void> {

    try {

      // set that the receipt will not be removed case it is an update
      if (!transaction.id) {
        transaction.isReceiptRemoved = false;
      }

      // get the url and the data in a proper format to be save
      const url =  (transaction.id)? 'transactions/' + transaction.id : 'transactions';
      let data = this.mapToApi(transaction);

      // set the image using FormData to be sent along case it has been taken
      let config: AxiosRequestConfig = null;
      if (transaction.isNewReceipt) {

        data = this.createFormData(data, transaction.receipt);
        config = {headers: { 'Content-Type': 'multipart/form-data' }}
      }

      // make the request to save the transaction in the server
      const res: AxiosResponse = await this.api.post(url, data, config);

      // replace the transaction on the list
      transaction = this.mapToStore(res.data);
      this.replace(transaction);

    } catch (error) {

      // remove transaction from the current list
      this.removeFromList(transaction);

      // throw an error message
      const method = 'TransactionsServiceApi.save';
      let msg = 'Unable to save the transaction due to a server error. Try again later!';
      this.handleHttpError(method, msg, error, showError);

    } finally {

      // take the transaction out of the lists
      this.removeFromListToSave(transaction);
    }
  }

  /**
   * Create an multipart/form-data to save the transaction uploading the receipt
   *
   * @param data - transaction's data to transmit
   * @param receipt - the URI of receipt
   */
  private createFormData(data, receipt) {

    const form = new FormData();

    form.append('receipt', {
      uri: receipt,
      type: 'image/png',
      name: 'receipt.png',
    });

    Object.keys(data).forEach(key => {
      if (key !== 'receipt') {
        form.append(key, data[key] || '');
      }
    });

    return form;
  };

  /**
   * Persist all remaining transactions on the list to save
   */
  async saveAll():Promise<void> {

    for (let i = 0; i < this.listToSave.length; i++) {
      await this.save(this.listToSave[i], false);
    }
  }

  /**
   * Remove the transaction
   */
  async delete(transaction: TransactionModel):Promise<void> {

    try {

      if (transaction.id) {
        await this.api.delete('transactions/' + transaction.id);
      }

    } catch (error) {

      const method = 'TransactionsServiceApi.delete';
      let msg = 'Unable to remove the transaction due to a server error. Try again later!';
      this.handleHttpError(method, msg, error);
    }
  }

  /**
   * Format transaction to save it in the server
   *
   * @private
   */
  private mapToApi(transaction: TransactionModel): object {
    return {
      id: transaction.id,
      key: transaction.key,
      type: transaction.type,
      category: transaction.category.name,
      amount: transaction.amount,
      place: transaction.place,
      description: transaction.description,
      ordered_at: moment(transaction.timestamp).format(),
      is_receipt_removed: transaction.isReceiptRemoved,
    }
  }

  /**
   * Format a transaction's data comes from the server to a TransactionModel
   *
   * @param transaction
   * @private
   */
  private mapToStore(transaction): TransactionModel {
    return {
      id: transaction['id'],
      amount: transaction['amount'],
      type: transaction['type'],
      category: transaction['category'],
      place: transaction['place'],
      description: transaction['description'],
      receipt: transaction['receipt'],
      isNewReceipt: false,
      timestamp: transaction['ordered_at'],
      orderDate: new Date(transaction['ordered_at']),
      orderTime: new Date(transaction['ordered_at']),
      isOwner: transaction['is_owner'],
      currency: transaction['currency'],
      currencyExchange: transaction['currencyExchange'],
      key: transaction['key'],
      isReceiptRemoved: false,
    }
  }
}