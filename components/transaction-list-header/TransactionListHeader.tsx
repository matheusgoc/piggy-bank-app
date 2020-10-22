import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { StyleSheet, Text, View } from "react-native";
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
import TransactionsServiceApi from '../../services/TransactionsServiceApi';

const TransactionListHeader = () => {

  const serviceApi = new TransactionsServiceApi();
  const dispatch = useDispatch();

  const list = useSelector(getList);
  const date = useSelector(getDate);
  const loading = useSelector(getLoadingList);
  const isDeleteEnable = useSelector(checkDeleteEnable);

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
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceInfoText}>Balance $1,103.91</Text>
          <Text style={styles.balanceInfoText}>$6,027.32 - $5.823,41</Text>
        </View>
        <Button
          disabled={!list.length || loading}
          onPress={() => handleOnDelete()}
          icon={{
            name: (isDeleteEnable)? 'delete-forever' : 'delete-sweep',
            color: (!list.length || loading)
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
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'left',
    width: 50,
    padding: 0,
  }
});

export default TransactionListHeader