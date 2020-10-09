import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from "react-native";
import moment from 'moment';
import { TransactionModel } from '../../models/TransactionModel';
import { COLORS } from '../../constants';
import { Icon } from 'react-native-elements';

const TransactionsView = ({ route }) => {

  const transaction: TransactionModel = route.params.transaction;
  const type = (transaction.type === 'E')? 'Expense' : 'Income';
  const category = transaction.category.name;
  const amount = new Intl.NumberFormat(
    'en-US',
    { style: 'currency', currency: 'USD'}
  ).format(transaction.amount);
  const place = transaction.place || '---';
  const date = moment(transaction.timestamp).format('MM-DD-YYYY[ at ]HH:mma');
  const description = transaction.description || '---'

  const styles = StyleSheet.create({
    ...baseStyles,
    amount: {
      ...baseStyles.detailValue,
      color: (transaction.amount > 0)? COLORS.success : COLORS.error,
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.details}>
        <View style={styles.detailsLabels}>
          <Text style={styles.detailLabel}>Type:</Text>
          <Text style={styles.detailLabel}>Category:</Text>
          <Text style={styles.detailLabel}>Amount:</Text>
          <Text style={styles.detailLabel}>Place</Text>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailLabel}>Description:</Text>
        </View>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.detailValue}>{type}</Text>
            <Icon
              name={(transaction.amount > 0)? 'caret-up' : 'caret-down'}
              color={(transaction.amount > 0)? COLORS.success : COLORS.error}
              type='font-awesome'
              style={{paddingLeft: 10}}
            />
          </View>
          <Text style={styles.detailValue}>{category}</Text>
          <Text style={styles.amount}>{amount}</Text>
          <Text style={styles.detailValue}>{place}</Text>
          <Text style={styles.detailValue}>{date}</Text>
          <Text style={styles.detailValue}>{description}</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const detailValueStyle = {
  fontSize: 18,
  paddingVertical: 5,
};
const baseStyles = StyleSheet.create({
  container: {
    margin: 0,
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
    height: '100%',
    padding: 10,
  },
  details: {
    flexDirection: 'row',
  },
  detailsLabels: {
    paddingRight: 10,
  },
  detailLabel: {
    ...detailValueStyle,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  detailValue: {
    ...detailValueStyle,
  },
});

export default TransactionsView