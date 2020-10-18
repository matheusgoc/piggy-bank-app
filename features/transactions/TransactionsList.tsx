import React from 'react';
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider, Icon } from 'react-native-elements';
import TransactionListHeader from '../../components/transaction-list-header/TransactionListHeader';
import { TransactionModel } from '../../models/TransactionModel'
import TransactionListItem from '../../components/transaction-list-item/TransactionListItem';
import { getList, getLoadingList, setDeleteEnable } from './TransactionsSlice';
import TransactionListPlaceholder from '../../components/transaction-list-item/TransactionListPlaceholder';
import { COLORS } from '../../constants';

const TransactionsList = ({ navigation }) => {

  const dispatch = useDispatch();
  const loading = useSelector(getLoadingList);
  const list = useSelector(getList);

  const handleItemPress = (transaction: TransactionModel | string, index: number) => {

    dispatch(setDeleteEnable(false));
    navigation.navigate('TransactionEdit', { transaction: JSON.stringify(transaction) });
  }

  const renderItem = (transaction: TransactionModel, index: number) => {

    return (
      <TransactionListItem
        index={index}
        transaction={{...transaction}}
        onPress={() => handleItemPress(transaction, index)}
      />
    );
  };

  const renderList = () => {
    let listToRender = null

    if (loading) {

      listToRender = Array(15).fill('').map((value, index) => {
        return (<TransactionListPlaceholder key={index} />)
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
    height: '100%',
    paddingBottom: 100,
  },
  emptyText: {
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: 'bold',
    paddingTop: 10
  }
});

export default TransactionsList