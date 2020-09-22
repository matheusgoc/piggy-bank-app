import TransactionsService from './TransactionsService';
import { TransactionModel } from '../models/TransactionModel';
import { HTTP_STATUS } from '../constants';
import BaseService from './BaseService';
import { AxiosResponse } from 'axios';

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
   * Load the list
   */
  async load(direction?: 'up'|'down'):Promise<void> {
    try {

      // define the URL
      let url = 'transactions';
      if (direction) {
        // get the timestamp of the last or the first transaction on the list based on the given direction
        const baseTimestamp = this.list.find((transaction, index) => {
          return (
            direction == 'up' && this.list.length == index - 1 || // last
            direction == 'down' && this.list.length == 0 // first
          );
        })[0].timestamp;
        url += '/' + baseTimestamp + '/' + direction;
      }

      // request the transactions and load the list
      const res: object[] = await this.api.get(url);
      this.list = res.map((item): TransactionModel => {
        return this.mapToStore(item);
      });

    } catch(error) {

      const method = 'TransactionsServiceApi.load';
      const msg = 'Unable to retrieve transactions from the server';
      this.handleHttpError(method, msg, error);
    }
  }

  /**
   * Persist a transaction
   *
   * @param index[optional] default: last transaction added or updated
   * @param hasErrorAlert[optional] default: true
   */
  async save(index = this.listToSave.length - 1, hasErrorAlert = true):Promise<void> {

    try {

      if (index < 0) {
        throw new Error('Invalid transaction index to save');
      }

      let res: AxiosResponse;
      let transaction = this.listToSave[index];
      if (transaction.id) {

        res = await this.api.put('transaction/' + transaction.id, this.mapToApi(transaction));

      } else {

        res = await this.api.post('transaction', this.mapToApi(transaction));
      }

      transaction = this.mapToStore(res.data.profile);
      this.removeFromListToSave(transaction);
      this.replace(transaction);
      this.store();

    } catch (error) {

      const method = 'TransactionsServiceApi.save';
      let msg = 'Unable to save the transaction due to a server error. Try again later!';
      this.handleHttpError(method, msg, error, hasErrorAlert);
    }
  }

  /**
   * Persist all remaining transactions on the list to save
   */
  async saveAll():Promise<void> {

    for (let i = 0; i < this.listToSave.length; i++) {
      await this.save(i, false);
    }
  }

  /**
   * Remove the transaction
   */
  async delete():Promise<void> {

    const idsToRemove = this.listToRemove.map((transaction) => {
      return transaction.id;
    }).join(',');

    try {

      await this.api.delete('transactions/' + idsToRemove);
      this.listToRemove = [];
      this.store();

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
      type: transaction.type,
      category: transaction.category,
      is_owner: transaction.isOwner,
      amount: transaction.amount,
      place: transaction.place,
      description: transaction.description,
      receipt: transaction.receipt,
      ordered_at: transaction.timestamp,
      key: transaction.key,
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
      orderDate: new Date(transaction['timestamp']),
      orderTime: new Date(transaction['timestamp']),
      isOwner: transaction['is_owner'],
      currency: transaction['currency'],
      currencyExchange: transaction['currencyExchange'],
      key: transaction['key'],
    }
  }
}