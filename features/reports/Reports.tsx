import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import TransactionListHeader from '../../components/transaction-list-header/TransactionListHeader';
import ReportsSavingsPlan from './ReportSavingsPlan';
import { Divider } from 'react-native-elements';

const Reports = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TransactionListHeader disableDelete={true} />
      <Divider />
      <ReportsSavingsPlan />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    height: '100%'
  }
});

export default Reports