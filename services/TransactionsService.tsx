import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import BaseService, { IService } from './BaseService';
import {
  setList,
  setListToRemove,
  setListToSave,
  getList,
  getListToSave,
  getListToRemove
} from '../features/transactions/TransactionsSlice';
import { TransactionModel } from '../models/TransactionModel';
import { store } from '../store';

/**
 * TransactionsService
 * A service to handle the transaction's state persistence
 *
 * @extends BaseService
 */
export default class TransactionsService extends BaseService implements IService {

  protected list: TransactionModel[];
  protected listToSave: TransactionModel[];
  protected listToRemove: TransactionModel[];

  constructor() {
    super();
    this.syncFromStore();
  }

  /**
   * Store the transactions' lists
   */
  store() {
    store.dispatch(setList(this.list));
    store.dispatch(setListToSave(this.listToSave));
    store.dispatch(setListToRemove(this.listToRemove));
  }

  /**
   * Exchange the current transactions' lists with the stored list
   */
  syncFromStore() {
    this.list = getList(store.getState());
    this.listToSave = getListToSave(store.getState());
    this.listToRemove = getListToRemove(store.getState());
  }

  /**
   * Retrieves the stored transactions' list
   */
  get(): TransactionModel[] {
    this.syncFromStore();

    return this.list;
  }

  /**
   * Set the list of transactions
   * @param list
   */
  set(list: TransactionModel[]): void {
    this.list = (list)? list : [];
  }

  /**
   * Add a new transaction to the correct position on the current list
   * @param newTransaction
   */
  add(newTransaction: TransactionModel): void {

    // define a new random key for the transaction case it wasn't done before
    if (!newTransaction.key) {
      newTransaction.key = uuidv4();
    }

    // look for a transaction with a date and time greater then the new one
    const greaterIndex = this.list.findIndex(
      transaction => transaction.timestamp > newTransaction.timestamp
    );

    // add the transaction in the right position on the list
    if (greaterIndex >= 0){
      this.list.splice(greaterIndex, 0, {...newTransaction});
    } else {
      this.list.push({...newTransaction});
    }

    // add the transaction on the list to be saved
    this.listToSave.push({...newTransaction});

    this.store();
  }

  /**
   * Update the transaction on the list
   * @param transaction
   */
  update(transaction: TransactionModel): void {

    const index = this.findSameTransactionIndex(transaction);
    this.list[index] = {...transaction};

    const indexToSave = this.findSameTransactionIndex(transaction, this.listToSave);
    if (indexToSave >= 0) {
      this.listToSave[indexToSave] = {...transaction};
    } else {
      this.listToSave.push({...transaction});
    }

    this.store();
  }

  /**
   * Remove a transaction from the current list
   * @param index
   */
  remove(index: number): void {
    const removedTransaction = this.list.splice(index, 1)[0];
    this.removeFromListToSave(removedTransaction);
    if (removedTransaction.id) {
      this.listToRemove.push(removedTransaction);
    }
    this.store();
  }

  /**
   * Remove a given transaction from the list of transactions to save
   * @param transactionToRemove
   * @private
   */
  removeFromListToSave(transactionToRemove: TransactionModel): number {
    const toRemoveIndex = this.findSameTransactionIndex(transactionToRemove, this.listToSave);
    if (toRemoveIndex >= 0) {
      this.listToSave.splice(toRemoveIndex, 1);
    }

    return toRemoveIndex;
  }

  /**
   * Retrieve a transaction index of a given list of transactions
   * @param transactionToFind
   * @param list
   * @private
   */
  private findSameTransactionIndex(transactionToFind: TransactionModel, list: TransactionModel[] = this.list): number {
    const transactionToFindJSON = JSON.stringify(transactionToFind);
    return (list.length)? list.findIndex((transaction) => {
      return (transactionToFind.id && transactionToFind.id === transaction.id) ||
        transaction.key === transaction.key ||
        JSON.stringify(transaction) === transactionToFindJSON
    }) : -1;
  }

  /**
   * Replace a transaction in a list
   *
   * @param transaction
   * @param list
   * @protected
   */
  protected replace(transaction: TransactionModel, list: TransactionModel[] = this.list): void {
    const index = this.findSameTransactionIndex(transaction, list);
    if (index >= 0) {
      list.splice(index, 1, transaction);
    }
  }
}