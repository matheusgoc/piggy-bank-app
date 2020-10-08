import React from 'react';
import { FlatList, StyleSheet, View, Text, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import TransactionListHeader from '../../components/transaction-list-header/TransactionListHeader';
import { Divider, Icon } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { TransactionModel } from '../../models/TransactionModel'
import TransactionListItem from '../../components/transaction-list-item/TransactionListItem';
import { getList, getLoadingList } from './TransactionsSlice';
import TransactionsServiceApi from '../../services/TransactionsServiceApi';
import TransactionListPlaceholder from '../../components/transaction-list-item/TransactionListPlaceholder';
import { COLORS } from '../../constants';

const TransactionsList = () => {

  const loading = useSelector(getLoadingList);
  const list = useSelector(getList);
  const serviceApi = new TransactionsServiceApi();

  const handleItemPress = (transaction: TransactionModel | string, index: number) => {
    console.log('TransactionsList.handleItemPress', transaction, index);
  }

  const renderItem = (transaction: TransactionModel | string, index: number) => {

    return (
      <TransactionListItem
        transaction={transaction}
        onPress={() => handleItemPress(transaction, index)}
      />
    );
  };

  const renderList = () => {
    let listToRender = null

    if (loading) {

      listToRender = Array(15).fill('').map(() => {
        return (<TransactionListPlaceholder />)
      });

    } else if (list.length) {

      listToRender = (
        <FlatList
          data={list}
          renderItem={({ item, index }) => renderItem(item, index)}
          keyExtractor={item => item.key}
        />
      );

    } else {

      listToRender = (
        <View style={styles.empty}>
          <Icon
            name='exclamation-triangle'
            type='font-awesome'
            size={50}
            color={COLORS.gray}
          />
          <Text style={styles.emptyText}>
            No transactions on this month
          </Text>
        </View>
      );
    }

    return listToRender;
  }

  return (
    <SafeAreaView style={styles.container}>
      <TransactionListHeader />
      <Divider />
      {renderList()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    height: '100%'
  },
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '90%'
  },
  emptyText: {
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: 'bold',
    paddingTop: 10
  }
});

export default TransactionsList