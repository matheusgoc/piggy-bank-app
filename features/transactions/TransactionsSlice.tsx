import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';
import { TransactionModel } from '../../models/TransactionModel';

let reqCount = 0;

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
      state.loadingList = action.payload;
    },

    setDeleteEnable: (state, action: PayloadAction<boolean>) => {
      state.isDeleteEnable = action.payload;
    },

    // set the current moment
    setDate: (state, action: PayloadAction<Date>) => {
      state.date = action.payload;
    },

    // rearrange the list depending on the request direction
    setList: (state, action: PayloadAction<TransactionModel[]>) => {
      state.list = action.payload;
    },

    // set the list to save
    setListToSave: (state, action) => {
      state.listToSave = action.payload;
    },

    // set the list to remove
    setListToRemove: (state, action) => {
      state.listToRemove = action.payload;
    },

    // Add a new transaction to the correct position on the current list
    addTransaction: (state, action:PayloadAction<TransactionModel>) => {

      const newTransaction = action.payload;

      // generate a new random key for the transaction case it wasn't done before
      if (!newTransaction.key) {
        newTransaction.key = uuidv4();
      }

      if (moment(state.date).isSame(newTransaction.timestamp, 'month')) {

        // look for a transaction with a date and time greater then the new one
        const greaterIndex = state.list.findIndex(
          transaction => transaction.timestamp > newTransaction.timestamp
        );

        // add the transaction in the correct position to the list
        if (greaterIndex >= 0){
          state.list.splice(greaterIndex, 0, newTransaction);
        } else {
          state.list.push(newTransaction);
        }
      }

      // add the transaction to the list to be saved
      state.listToSave.push(newTransaction);
    },

    // Update a transaction in the current list and in the list save case it is there also
    updateTransaction: (state, action: PayloadAction<TransactionModel>) => {

      const transaction = action.payload;

      // find the transaction on the current list and replace it
      const index = findTransactionIndex(transaction, state.list);
      state.list.splice(index, 1, transaction);

      // find the transaction on the list to save and replace or add it
      const indexToSave = findTransactionIndex(transaction, state.listToSave);
      if (indexToSave >= 0) {
        state.listToSave.splice(indexToSave, 1, transaction);
      } else {
        state.listToSave.push(transaction);
      }
    },

    // remove a transaction
    removeTransaction: (state, action) => {

      const index = action.payload;

      // remove transaction from the current list
      const removedTransaction = {...state.list[index]};
      state.list.splice(index, 1);

      // add transaction to the list to remove if it has been saved on server
      if (removedTransaction.id) {
        state.listToRemove.push(removedTransaction);
      }

      // remove transaction from the list to save if it is there
      TransactionsSlice.caseReducers.removeTransactionFromListToSave(state, removedTransaction);
    },

    // Remove a transaction from the list to be saved
    removeTransactionFromListToSave: (state, action: PayloadAction<TransactionModel>) => {

      const toRemoveIndex = findTransactionIndex(action.payload, state.listToSave);
      if (toRemoveIndex >= 0) {

        state.listToSave.splice(toRemoveIndex, 1);
      }
    },

    // Remove a transaction from the list to be removed
    removeTransactionFromListToRemove: (state, action: PayloadAction<TransactionModel>) => {

      const toRemoveIndex = findTransactionIndex(action.payload, state.listToSave);
      if (toRemoveIndex >= 0) {

        state.listToRemove.splice(toRemoveIndex, 1);
      }
    },

    // Remove a transaction from the current list
    removeTransactionFromList: (state, action: PayloadAction<TransactionModel>) => {

      const toRemoveIndex = findTransactionIndex(action.payload, state.list);
      if (toRemoveIndex >= 0) {

        state.list.splice(toRemoveIndex, 1);
      }
    },

    // Replace the transaction in the current list
    replaceTransaction: (state, action: PayloadAction<TransactionModel>) => {

      const transaction = action.payload;
      const index = findTransactionIndex(transaction, state.list);
      if (index >= 0) {

        state.list[index] = transaction;
      }
    },
  },
});

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
  }) : -1;
}

//actions
export const {
  setLoadingList,
  setDeleteEnable,
  setDate,
  setList,
  setListToSave,
  setListToRemove,
  addTransaction,
  updateTransaction,
  replaceTransaction,
  removeTransaction,
  removeTransactionFromListToSave,
  removeTransactionFromListToRemove,
  removeTransactionFromList,
} = TransactionsSlice.actions;

//selectors
export const getDate = state => state.transactions.date;
export const getList = state => state.transactions.list;
export const getListToSave = state => state.transactions.listToSave;
export const getListToRemove = state => state.transactions.listToRemove;
export const getLoadingList = state => state.transactions.loadingList;
export const checkDeleteEnable = state => state.transactions.isDeleteEnable;

//reducers
export default TransactionsSlice.reducer;
