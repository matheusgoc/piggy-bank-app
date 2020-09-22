import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import TransactionForm from './TransactionForm';
import { TransactionModel } from '../../models/TransactionModel';
import TransactionsServiceApi from '../../services/TransactionsServiceApi';
import { store } from '../../store';
import { toggleLoading } from '../navigation/NavigationSlice';
import { TOAST } from '../../constants';
import CategoriesServiceApi from '../../services/CategoriesServiceApi';

interface TransactionsListProps {
  transaction: TransactionModel;
}

const transactionsServiceApi = new TransactionsServiceApi();
const categoriesServiceApi = new CategoriesServiceApi();

const extractTimestamp = (transaction) => {
  transaction.orderDate.setHours(
    transaction.orderTime.getHours(),
    transaction.orderTime.getMinutes(),
    transaction.orderTime.getSeconds(),
  );
  return transaction.orderDate.getTime();
}

const Transaction = withFormik<TransactionsListProps, TransactionModel>({

  mapPropsToValues: props => {

    return (props.transaction)? props.transaction : new TransactionModel();
  },

  validationSchema: Yup.object({
    type: Yup.string()
      .required('Required'),
    category: Yup.string()
      .required('Required'),
    total: Yup.string()
      .required('Required'),
    date: Yup.date()
      .required('Required'),
  }),

  handleSubmit: (transaction: TransactionModel, bag:any)  => {

    store.dispatch(toggleLoading());
    transaction.timestamp = extractTimestamp(transaction);

    let successMsg: string;
    if (transaction.id) {
      transactionsServiceApi.update(transaction);
      successMsg = 'The transaction was updated!';
    } else {
      transactionsServiceApi.add(transaction);
      successMsg = 'A new transaction was add!';
    }

    transactionsServiceApi.save().then(() => {
      TOAST.ref.alertWithType(
        'success',
        'Transaction saved',
        successMsg,
      );
      bag.props.navigation.back();
    }).catch((error) => {
      console.warn('Transaction.handleSubmit: ' + error.message);
    }).finally(() => {
      store.dispatch(toggleLoading());
    });
  },

})(TransactionForm);

export default Transaction;