import * as FileSystem from 'expo-file-system'
import moment from 'moment'
import BaseService from './BaseService'
import {
  addTransaction,
  clearTransactions,
  getDate,
  getList,
  getListToRemove,
  removeTransaction,
  removeTransactionFromList,
  removeTransactionFromListToRemove,
  removeTransactionFromListToSave,
  replaceTransaction,
  setDate,
  setList,
  updateTransaction,
} from '../features/transactions/TransactionsSlice'
import { updateReport } from '../features/reports/ReportsSlice'
import { TransactionModel } from '../models/TransactionModel'
import ReportService from './ReportService'

/**
 * TransactionsService
 * A service to handle the transaction's state persistence
 *
 * @extends BaseService
 */
export default class TransactionsService extends BaseService {

  public list: TransactionModel[]
  public listToSave: TransactionModel[]
  public listToRemove: TransactionModel[]
  public date: Date
  protected reportService: ReportService

  constructor() {

    super()
    this.reportService = new ReportService()
    this.syncFromStore()
  }

  syncFromStore() {

    this.list = getList(this.getState())
    this.listToSave = getListToRemove(this.getState())
    this.listToRemove = getListToRemove(this.getState())
    this.date = getDate(this.getState())
  }

  set(list: TransactionModel[]): void {

    this.dispatch(setList(list))
  }

  setDate(date: Date = new Date()): void {

    this.dispatch(setDate(date))
  }

  add(transaction: TransactionModel): void {

    this.syncFromStore()

    const currentMonth = Number(moment(this.date).format('YYYYMM'))
    const transactionMonth = Number(moment(transaction.timestamp).format('YYYYMM'))
    if (transactionMonth <= currentMonth) {
      this.dispatch(updateReport({
        transaction,
        hasMonthly: currentMonth == transactionMonth,
        operator: 'add'
      }))
    }

    this.dispatch(addTransaction(transaction))
  }

  update(transaction: TransactionModel, oldTransaction: TransactionModel): void {

    this.syncFromStore()

    this.dispatch(updateReport({
      transaction: oldTransaction,
      hasMonthly: true,
      operator: 'sub'
    }))

    const currentMonth = Number(moment(this.date).format('YYYYMM'))
    const transactionMonth = Number(moment(transaction.timestamp).format('YYYYMM'))
    console.log('update', currentMonth, transactionMonth)
    if (transactionMonth <= currentMonth) {
      this.dispatch(updateReport({
        transaction,
        hasMonthly: currentMonth == transactionMonth,
        operator: 'add'
      }))
    }

    this.dispatch(updateTransaction(transaction))
  }

  async storeReceiptPicture(transaction: TransactionModel): Promise<void> {

    if (transaction.isNewReceipt) {
      await FileSystem.copyAsync({
        from: transaction.receipt,
        to: FileSystem.documentDirectory + '/receipts/' + transaction.key,
      })
    }
  }

  remove(index: number): void {

    this.syncFromStore()

    const transaction = this.list[index]
    const currentMonth = Number(moment(this.date).format('YYYYMM'))
    const transactionMonth = Number(moment(transaction.timestamp).format('YYYYMM'))
    if (transactionMonth <= currentMonth) {
      this.dispatch(updateReport({
        transaction: transaction,
        hasMonthly: currentMonth == transactionMonth,
        operator: 'sub'
      }))
    }
    this.dispatch(removeTransaction(index))
  }

  clear(): void {

    this.dispatch(clearTransactions())
  }

  protected removeFromList(transactionToRemove: TransactionModel): void {

    this.dispatch(removeTransactionFromList(transactionToRemove))
  }

  protected removeFromListToSave(transactionToRemove: TransactionModel): void {

    this.dispatch(removeTransactionFromListToSave(transactionToRemove))
  }

  protected removeFromListToRemove(transactionToRemove: TransactionModel): void {

    this.dispatch(removeTransactionFromListToRemove(transactionToRemove))
  }

  protected replace(transaction: TransactionModel): void {

    this.dispatch(replaceTransaction(transaction))
  }
}