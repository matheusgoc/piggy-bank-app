import React, { useState } from 'react';
import { StyleSheet, Text, View } from "react-native";
import { Button, Icon } from 'react-native-elements';
import { VictoryBar, VictoryChart, VictoryLegend, VictoryPie, VictoryTheme } from "victory-native";
import { COLORS } from '../../constants';
import { ReportModel } from '../../models/ReportModel';

interface ReportCategoriesProps {
  type: 'general' | 'monthly',
  report: ReportModel,
}

const ReportCategories = (props: ReportCategoriesProps) => {

  const [type, setType] = useState('expense');
  const [graph, setGraph] = useState('pie');

  const changeType = () => {
    setType((type == 'expense')? 'income' : 'expense');
  }

  const changeGraph = () => {
    setGraph((graph == 'pie')? 'chart' : 'pie');
  }

  const styles = StyleSheet.create({
    ...baseStyles,
    headerButtonTitle: {
      ...baseStyles.headerButtonTitle,
      color: (type == 'expense')? COLORS.error : COLORS.primary,
    }
  });

  const getCategoriesReport = () => {
    return (type == 'expense')
      ? props.report.categories.expenses
      : props.report.categories.incomes;
  }

  const getData = () => {
    const report = getCategoriesReport();
    let data = [];
    if (report) {
      for (const [category, value] of Object.entries(report)) {
        data.push({x: category, y:value, label: ''});
      }
    }
    return data;
  }

  const getLegend = () => {
    const report = getCategoriesReport();
    let data = [];
    if (report) {
      for (const category of Object.keys(report)) {
        data.push({name: category});
      }
    }
    return data;
  }

  const displayChart = () => {

    const data = getData();

    let chart = null;
    if (data && data.length) {
      chart = (
        <>
          {(graph == 'pie')? (
            <VictoryPie
              data={data}
              theme={VictoryTheme.material}
              colorScale='qualitative'
              innerRadius={80}
              animate={{ duration: 1000 }}
            />
          ) : (
            <VictoryChart
              theme={VictoryTheme.material}
              domainPadding={10}>
              <VictoryBar
                data={data}
                alignment="start"
                animate={{ duration: 1000 }}
              />
            </VictoryChart>
          )}
          <VictoryLegend
            data={getLegend()}
            x={20}
            y={0}
            colorScale='qualitative'
            orientation="vertical"
            rowGutter={{ top: 0, bottom: 10 }}
            theme={VictoryTheme.material}
          />
        </>
      )
    } else {
      chart = (
        <View style={styles.empty}>
          <Icon
            name='exclamation-triangle'
            type='font-awesome'
            size={50}
            color={COLORS.gray}
          />
          <Text style={styles.emptyText}>
            {(type == 'expense')? 'No expenses' : 'No incomes'}
          </Text>
        </View>
      )
    }

    return chart;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          onPress={changeType}
          type='clear'
          title={(type == 'expense')
            ? (props.type == 'general')? 'General Expenses' : 'Monthly Expenses'
            : (props.type == 'general')? 'General Incomes' : 'Monthly Incomes'}
          titleStyle={styles.headerButtonTitle}
          icon={{
            name: (type == 'expense')? 'caret-down' : 'caret-up',
            color: (type == 'expense')? COLORS.error : COLORS.primary,
            type: 'font-awesome',
          }}
        />
        <Button
          onPress={changeGraph}
          type='clear'
          icon={{
            name: (graph == 'pie')? 'bar-chart' : 'pie-chart',
            color: (type == 'expense')? COLORS.error : COLORS.primary,
            type: 'font-awesome',
          }}
        />
      </View>
      {displayChart()}
    </View>
  )
}

const baseStyles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  graph: {},
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: 'bold',
    paddingTop: 10
  }
});

export default ReportCategories