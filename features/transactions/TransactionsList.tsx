import React from 'react';
import { Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const TransactionsList = () => {
  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Transactions</Text>
    </SafeAreaView>
  )
}

export default TransactionsList