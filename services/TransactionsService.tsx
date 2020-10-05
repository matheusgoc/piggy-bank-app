import * as FileSystem from 'expo-file-system';
import BaseService from './BaseService';
import {
  addTransaction,
  getList,
  getListToRemove,
  removeTransaction,
  removeTransactionFromList,
  removeTransactionFromListToSave,
  removeTransactionFromListToRemove,
  replaceTransaction,
  setList,
  updateTransaction,
} from '../features/transactions/TransactionsSlice';
import { TransactionModel } from '../models/TransactionModel';

export type ListDirectionType = 'after'|'before';

/**
 * TransactionsService
 * A service to handle the transaction's state persistence
 *
 * @extends BaseService
 */
export default class TransactionsService extends BaseService {

  public list: TransactionModel[];
  public listToSave: TransactionModel[];
  public listToRemove: TransactionModel[];

  constructor() {
    super();
    this.syncFromStore();
  }

  syncFromStore() {
    this.list = getList(this.getState());
    this.listToSave = getListToRemove(this.getState());
    this.listToRemove = getListToRemove(this.getState());
  }

  get(): TransactionModel[] {
    this.syncFromStore();

    return this.list;
  }

  set(list: TransactionModel[], direction?: ListDirectionType): void {

    this.dispatch(setList({list, direction}));
  }

  add(newTransaction: TransactionModel): void {

    this.dispatch(addTransaction(newTransaction));
  }

  update(transaction: TransactionModel): void {

    this.dispatch(updateTransaction(transaction));
  }

  async storeReceiptPicture(transaction: TransactionModel): Promise<void> {
    if (transaction.isNewReceipt) {
      await FileSystem.copyAsync({
        from: transaction.receipt,
        to: FileSystem.documentDirectory + '/receipts/' + transaction.key,
      });
    }
  }

  remove(index: number): void {

    this.dispatch(removeTransaction(index));
  }

  protected removeFromList(transactionToRemove: TransactionModel): void {

    this.dispatch(removeTransactionFromList(transactionToRemove));
  }

  protected removeFromListToSave(transactionToRemove: TransactionModel): void {

    this.dispatch(removeTransactionFromListToSave(transactionToRemove));
  }

  protected removeFromListToRemove(transactionToRemove: TransactionModel): void {

    this.dispatch(removeTransactionFromListToRemove(transactionToRemove));
  }

  protected replace(transaction: TransactionModel): void {

    this.dispatch(replaceTransaction(transaction));
  }
}