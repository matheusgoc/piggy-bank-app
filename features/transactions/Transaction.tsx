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
  route: any,
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

let oldTransaction = null;

const Transaction = withFormik<TransactionsListProps, TransactionModel>({

  mapPropsToValues: props => {

    let transaction: TransactionModel = new TransactionModel();

    // set transaction from list
    if (props.route?.params?.transaction) {
      transaction = JSON.parse(props.route?.params?.transaction);
      oldTransaction = {...transaction};
      transaction.amount = Math.abs(transaction.amount);
      if (transaction.timestamp) {
        transaction.orderDate = new Date(transaction.timestamp);
        transaction.orderTime = new Date(transaction.timestamp);
      }
    }

    // set type
    transaction.type = {
      label: (transaction.type == 'E')? 'Expense' : 'Income',
      value: transaction.type
    }

    return transaction;
  },

  validationSchema: Yup.object().shape({
    type: Yup.string()
      .required('Required'),
    category: Yup.object().shape({
      name: Yup.string().required('Required'),
    }),
    amount: Yup.number().nullable()
      .min(.01, 'Required')
      .required('Required'),
    orderDate: Yup.date().nullable()
      .required('Required'),
    place: Yup.string().nullable()
      .max(45, "45 characters at most"),
    description: Yup.string().nullable()
      .max(244, "244 characters at most"),
  }),

  handleSubmit: (transaction: TransactionModel, bag:any)  => {

    showLoading(true);

    // set timestamp
    transaction.timestamp = extractTimestamp(transaction);

    // set type
    transaction.type = transaction.type.value;

    // save at device storage
    let successMsg: string;
    if (transaction.id) {
      transactionsServiceApi.update(transaction, oldTransaction);
      successMsg = 'The transaction was updated!';
    } else {
      transactionsServiceApi.add(transaction);
      successMsg = 'A new transaction was add!';
    }

    // persist at cloud server
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