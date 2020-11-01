import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Button } from 'react-native-elements';
import { COLORS } from '../../constants';
import {
  getList,
  getDate,
  setDate,
  getLoadingList,
  setLoadingList,
  setDeleteEnable,
  checkDeleteEnable,
} from '../../features/transactions/TransactionsSlice';
import {
  getGeneralReport,
  getMonthlyReport,
} from '../../features/reports/ReportsSlice';
import {
  getSavings
} from '../../features/profile/ProfileSlice'
import TransactionsServiceApi from '../../services/TransactionsServiceApi';
import { formatCurrency } from '../../helpers';
import { ReportModel } from '../../models/ReportModel';
import { ProfileSavingsModel } from '../../models/ProfileSavingsModel';

interface TransactionListHeaderProps {
  disableDelete?: boolean,
}

const TransactionListHeader = (props: TransactionListHeaderProps) => {

  const serviceApi = new TransactionsServiceApi();
  const dispatch = useDispatch();

  const list = useSelector(getList);
  const date = useSelector(getDate);
  const loading = useSelector(getLoadingList);
  const isDeleteEnable = useSelector(checkDeleteEnable);

  const generalReport: ReportModel = useSelector(getGeneralReport);
  const monthlyReport: ReportModel = useSelector(getMonthlyReport);
  const savingsPlan: ProfileSavingsModel = useSelector(getSavings);

  const [timeout, enableTimeout] = useState(null);
  let reqCount = 0;

  const styles = StyleSheet.create({
    ...baseStyles,
  });

  const handleOnChangeMonth = (direction: 'before'|'after') => {

    clearTimeout(timeout);

    dispatch(setDeleteEnable(false));
    dispatch(setLoadingList(true));

    let currentDate = moment(date);
    currentDate.startOf('month');
    const previousDate = moment(currentDate);
    switch (direction) {
      case 'before':
        currentDate.subtract(1, 'month');
        break;
      case 'after':
        currentDate.add(1, 'month');
        break;
    }

    dispatch(setDate(currentDate.toDate()));
    enableTimeout(setTimeout(() => {
      const year = currentDate.format('YYYY');
      const month = currentDate.format('MM');
      serviceApi.load(year, month).catch((error) => {
        dispatch(setDate(previousDate.toDate()));
        console.warn('TransactionListHeader.handleOnChangeMonth: ' + error);
      }).finally(() => {
        dispatch(setLoadingList(false));
      });
    },3000));
  }

  const handleOnSearch = () => {
    console.log('TransactionListHeader.handleOnSearch');
  }

  const handleOnDelete = () => {
    dispatch(setDeleteEnable(!isDeleteEnable));
  }

  const showBalance = () => {

    if (loading || !monthlyReport || !generalReport) {
      return (
        <ActivityIndicator color={COLORS.primary} />
      );
    }

    let monthlyIncomes = monthlyReport.incomes;
    let monthlyExpenses = monthlyReport.expenses;
    const generalBalance = generalReport.incomes - generalReport.expenses + savingsPlan.balance;
    const monthlyBalance = monthlyIncomes - monthlyExpenses;
    const prevMonthBalance = generalBalance - monthlyBalance;
    if (prevMonthBalance > 0) {
      monthlyIncomes += prevMonthBalance;
    } else {
      monthlyExpenses -= prevMonthBalance;
    }

    return (
      <View style={styles.balanceInfo}>
        <Text style={[styles.balanceInfoText, (generalBalance < 0)? {color:COLORS.error} : null]}>
          Balance
          {
            (generalBalance < 0)
              ? ' -(' + formatCurrency(Math.abs(generalBalance)) + ')'
              : ' ' + formatCurrency(generalBalance)
          }
        </Text>
        {(monthlyIncomes == 0 && monthlyExpenses == 0)? null : (
          <Text style={[styles.balanceInfoCalcText,(generalBalance < 0)? {color:COLORS.error} : null]}>
            {formatCurrency(monthlyIncomes)} - {formatCurrency(monthlyExpenses)}
          </Text>
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.calendar}>
        <Button
          onPress={() => handleOnChangeMonth('before')}
          icon={{
            name: 'arrow-left',
            color: COLORS.primary,
            type: 'simple-line-icon',
            size: 30,
          }}
          type='clear'
          buttonStyle={styles.btn}
        />
        <Text style={styles.calendarDate}>{moment(date).format('MMMM YYYY')}</Text>
        <Button
          onPress={() => handleOnChangeMonth('after')}
          icon={{
            name: 'arrow-right',
            color: COLORS.primary,
            type: 'simple-line-icon',
            size: 30,
          }}
          type='clear'
          buttonStyle={styles.btn}
        />
      </View>
      <View style={styles.balance}>
        <Button
          disabled={loading}
          onPress={() => handleOnSearch()}
          icon={{
            name: "search",
            color: (loading)? COLORS.mediumGray : COLORS.primary,
            type: 'font-awesome',
            size: 25,
          }}
          type='clear'
          buttonStyle={styles.btn}
        />
        {showBalance()}
        <Button
          disabled={props.disableDelete || !list.length || loading}
          onPress={() => handleOnDelete()}
          icon={{
            name: (isDeleteEnable)? 'delete-forever' : 'delete-sweep',
            color: (props.disableDelete || !list.length || loading)
              ? COLORS.mediumGray
              : (isDeleteEnable)? COLORS.error : COLORS.primary,
            type: 'material',
            size: 30,
          }}
          type='clear'
          buttonStyle={styles.btn}
        />
      </View>
    </View>
  )
}

const baseStyles = StyleSheet.create({
  container: {},
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarDate: {
    fontSize: 35,
    color: COLORS.primary,
  },
  balance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 60,
  },
  balanceInfo: {
    flexGrow: 2,
  },
  balanceInfoText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  balanceInfoCalcText: {
    fontSize: 14,
    textAlign: 'center',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'left',
    width: 50,
    padding: 0,
  }
});

export default TransactionListHeader