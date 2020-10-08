import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { StyleSheet, Text, View } from "react-native";
import { Button } from 'react-native-elements';
import { COLORS } from '../../constants';
import {
  getDate,
  getLoadingList,
  setDate,
  setLoadingList
} from '../../features/transactions/TransactionsSlice';
import TransactionsServiceApi from '../../services/TransactionsServiceApi';

// delete-sweep
// delete-forever
const TransactionListHeader = () => {

  const serviceApi = new TransactionsServiceApi();

  const dispatch = useDispatch();
  const date = useSelector(getDate);
  const loading = useSelector(getLoadingList);

  let time = null;
  const handleOnChangeMonth = (direction: 'before'|'after') => {

    dispatch(setLoadingList(true));

    let currentDate = moment(date);
    currentDate.startOf('month');
    switch (direction) {
      case 'before':
        currentDate.subtract(1, 'month');
        break;
      case 'after':
        currentDate.add(1, 'month');
        break;
    }

    dispatch(setDate(currentDate.toDate()));

    const year = currentDate.format('YYYY');
    const month = currentDate.format('MM');
    serviceApi.load(year, month).then(() => {
      dispatch(setLoadingList(false));
    });
  }

  const handleOnSearch = () => {
    console.log('TransactionListHeader.handleOnSearch');
  }

  const handleOnDelete = () => {
    console.log('TransactionListHeader.handleOnDelete');
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
          onPress={() => handleOnSearch()}
          icon={{
            name: "search",
            color: COLORS.primary,
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
          onPress={() => handleOnDelete()}
          icon={{
            name: "delete-sweep",
            color: COLORS.primary,
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

const styles = StyleSheet.create({
  container: {

  },
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
  },
  balanceInfo: {

  },
  balanceInfoText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btn: {
    // backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'left',
    width: 50,
    padding: 0,
  }
});

export default TransactionListHeader