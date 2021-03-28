import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'
import { TransactionModel } from '../../models/TransactionModel'

export const TransactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    date: moment().startOf('month').toDate(),
    list: [],
    listToSave: [],
    listToRemove: [],
    loadingList: false,
    isDeleteEnable: false,
  },
  reducers: {

    // set that the list is loading
    setLoadingList: (state, action: PayloadAction<boolean>) => {
      state.loadingList = action.payload
    },

    setDeleteEnable: (state, action: PayloadAction<boolean>) => {
      state.isDeleteEnable = action.payload
    },

    // set the current moment
    setDate: (state, action: PayloadAction<Date>) => {
      state.date = action.payload
    },

    // set the current list
    setList: (state, action: PayloadAction<TransactionModel[]>) => {
      state.list = action.payload
    },

    // Sort the list according to date and time
    sortList: (state) => {
      state.list.sort((t1: TransactionModel, t2: TransactionModel) => {
        return t1.timestamp - t2.timestamp
      })
    },

    // set the list to save
    setListToSave: (state, action) => {
      state.listToSave = action.payload
    },

    // set the list to remove
    setListToRemove: (state, action) => {
      state.listToRemove = action.payload
    },

    // Add a new transaction to the current list and the list to save
    addTransaction: (state, action:PayloadAction<TransactionModel>) => {

      const newTransaction = action.payload

      // generate a new random key for the transaction
      if (!newTransaction.key) {
        newTransaction.key = uuidv4()
      }

      // case the transaction is supposed to be on the current list
      if (moment(state.date).isSame(newTransaction.timestamp, 'month')) {

        // add the new transaction to the current list
        state.list.push(newTransaction)

        // sort the current list to put the new transaction in the right position
        TransactionsSlice.caseReducers.sortList(state)
      }

      // add the transaction to the list to save
      state.listToSave.push(newTransaction)
    },

    // Update a transaction in the current list and in the list to save
    updateTransaction: (state, action: PayloadAction<TransactionModel>) => {

      const transaction = action.payload

      // find the transaction on the list
      const index = findTransactionIndex(transaction, state.list)

      // case the transaction is still within the current month
      if (moment(state.date).isSame(transaction.timestamp, 'month')) {

        // update the transaction data
        state.list.splice(index, 1, transaction)
        TransactionsSlice.caseReducers.sortList(state)

      } else {

        // remove the transaction from the current list
        state.list.splice(index, 1)
      }

      // find the transaction on the list to save and replace or add it
      const indexToSave = findTransactionIndex(transaction, state.listToSave)
      if (indexToSave >= 0) {
        state.listToSave.splice(indexToSave, 1, transaction)
      } else {
        state.listToSave.push(transaction)
      }
    },

    // remove a transaction
    removeTransaction: (state, action) => {

      const index = action.payload

      // remove transaction from the current list
      const removedTransaction = {...state.list[index]}
      state.list.splice(index, 1)

      // add transaction to the list to remove if it has been saved on server
      if (removedTransaction.id) {
        state.listToRemove.push(removedTransaction)
      }

      // remove transaction from the list to save if it is there
      TransactionsSlice.caseReducers.removeTransactionFromListToSave(state, removedTransaction)
    },

    // Remove a transaction from the list to be saved
    removeTransactionFromListToSave: (state, action: PayloadAction<TransactionModel>) => {

      const toRemoveIndex = findTransactionIndex(action.payload, state.listToSave)
      if (toRemoveIndex >= 0) {

        state.listToSave.splice(toRemoveIndex, 1)
      }
    },

    // Remove a transaction from the list to be removed
    removeTransactionFromListToRemove: (state, action: PayloadAction<TransactionModel>) => {

      const toRemoveIndex = findTransactionIndex(action.payload, state.listToSave)
      if (toRemoveIndex >= 0) {

        state.listToRemove.splice(toRemoveIndex, 1)
      }
    },

    // Remove a transaction from the current list
    removeTransactionFromList: (state, action: PayloadAction<TransactionModel>) => {

      const toRemoveIndex = findTransactionIndex(action.payload, state.list)
      if (toRemoveIndex >= 0) {

        state.list.splice(toRemoveIndex, 1)
      }
    },

    // Replace the transaction in the current list
    replaceTransaction: (state, action: PayloadAction<TransactionModel>) => {

      const transaction = action.payload
      const index = findTransactionIndex(transaction, state.list)
      if (index >= 0) {

        state.list[index] = transaction
      }
    },

    clearTransactions: (state) => {
      state.list = []
      state.listToSave = []
      state.listToRemove = []
      delete state.date
      state.isDeleteEnable = false
      state.loadingList = false
    },
  },
})

/**
 * Find a transaction on a list and return its index position
 *
 * @param transactionToFind
 * @param list
 */
const findTransactionIndex = (transactionToFind: TransactionModel, list: TransactionModel[]): number => {
  return (list.length)? list.findIndex((transaction) => {
    return (transactionToFind.id && transactionToFind.id === transaction.id) ||
      transaction.key === transactionToFind.key
  }) : -1
}

//actions
export const {
  setLoadingList,
  setDeleteEnable,
  setDate,
  setList,
  sortList,
  setListToSave,
  setListToRemove,
  addTransaction,
  updateTransaction,
  replaceTransaction,
  clearTransactions,
  removeTransaction,
  removeTransactionFromListToSave,
  removeTransactionFromListToRemove,
  removeTransactionFromList,
} = TransactionsSlice.actions

//selectors
export const getDate = state => state.transactions.date
export const getList = state => state.transactions.list
export const getListToSave = state => state.transactions.listToSave
export const getListToRemove = state => state.transactions.listToRemove
export const getLoadingList = state => state.transactions.loadingList
export const checkDeleteEnable = state => state.transactions.isDeleteEnable

//reducers
export default TransactionsSlice.reducer
