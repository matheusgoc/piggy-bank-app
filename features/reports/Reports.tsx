import React from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import TransactionListHeader from '../../components/transaction-list-header/TransactionListHeader';
import ReportsSavingsPlan from './ReportSavingsPlan';
import ReportCategories from './ReportCategories';
import { Divider } from 'react-native-elements';
import { ReportModel } from '../../models/ReportModel';
import { getGeneralReport, getMonthlyReport } from './ReportsSlice';

const Reports = () => {

  const monthlyReport: ReportModel = useSelector(getMonthlyReport);
  const generalReport: ReportModel = useSelector(getGeneralReport);

  return (
    <SafeAreaView style={styles.container}>
      <TransactionListHeader disableDelete={true} />
      <Divider />
      <ScrollView>
        <ReportsSavingsPlan />
        <Divider />
        <ReportCategories type='monthly' report={monthlyReport}/>
        <Divider />
        <ReportCategories type='general' report={generalReport}/>
      </ScrollView>
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