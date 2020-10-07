import React from 'react';
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import TransactionListHeader from '../../components/transaction-list-header/TransactionListHeader';
import { Divider } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { TransactionModel } from '../../models/TransactionModel'
import TransactionListItem from '../../components/transaction-list-item/TransactionListItem';
import { getList } from './TransactionsSlice';

const TransactionsList = () => {

  const list = useSelector(getList);

  const handleItemPress = (transaction: TransactionModel, index: number) => {
    console.log('TransactionsList.handleItemPress', transaction);
  }

  const renderItem = (transaction: TransactionModel, index: number, separators) => {
    return (
      <TransactionListItem transaction={transaction} onPress={() => handleItemPress(transaction, index)} />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TransactionListHeader />
      <Divider />
      <FlatList
        data={list}
        renderItem={({ item, index, separators }) => {
          return renderItem(item, index, separators);
        }}
        keyExtractor={item => item.key}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingBottom: 110,
  }
});

export default TransactionsList