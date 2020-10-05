import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import TransactionForm from './TransactionForm';
import { TransactionModel } from '../../models/TransactionModel';
import TransactionsServiceApi from '../../services/TransactionsServiceApi';
import { TOAST } from '../../constants';
import { showLoading } from '../../helpers';

interface TransactionsListProps {
  transaction: TransactionModel;
}

const transactionsServiceApi = new TransactionsServiceApi();

const extractTimestamp = (transaction) => {
  if (transaction.orderTime) {
    transaction.orderDate.setHours(
      transaction.orderTime.getHours(),
      transaction.orderTime.getMinutes(),
      transaction.orderTime.getSeconds(),
    );
  }

  return transaction.orderDate.getTime();
}

const Transaction = withFormik<TransactionsListProps, TransactionModel>({

  mapPropsToValues: props => {

    return (props.transaction)? props.transaction : new TransactionModel();
  },

  validationSchema: Yup.object().shape({
    type: Yup.string()
      .required('Required'),
    category: Yup.object().shape({
      name: Yup.string().required('Required'),
    }),
    amount: Yup.number()
      .nullable()
      .required('Required'),
    orderDate: Yup.date()
      .required('Required'),
  }),

  handleSubmit: (transaction: TransactionModel, bag:any)  => {

    showLoading(true);
    transaction.timestamp = extractTimestamp(transaction);

    let successMsg: string;
    if (transaction.id) {
      transactionsServiceApi.update(transaction);
      successMsg = 'The transaction was updated!';
    } else {
      transactionsServiceApi.add(transaction);
      successMsg = 'A new transaction was add!';
    }

    transactionsServiceApi.save(transaction).then(() => {
      TOAST.ref.alertWithType(
        'success',
        'Transaction saved',
        successMsg,
      );

      bag.props.navigation.goBack();

    }).catch((error) => {

      console.warn('Transaction.handleSubmit: ' + error.message);

    }).finally(() => {

      showLoading(false);
    });
  },

})(TransactionForm);

export default Transaction;