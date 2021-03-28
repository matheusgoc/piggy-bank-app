import React, { useState } from 'react'
import { StyleSheet, Text, View } from "react-native"
import { Button, Icon } from 'react-native-elements'
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLegend,
  VictoryPie,
  VictoryTheme,
} from "victory-native"
import { COLORS, PALLET } from '../../constants'
import { ReportModel } from '../../models/ReportModel'
import { formatCurrency } from '../../helpers'

interface ReportCategoriesProps {
  type: 'general' | 'monthly',
  report: ReportModel,
}

const ReportCategories = (props: ReportCategoriesProps) => {

  const [type, setType] = useState('expense')
  const [graph, setGraph] = useState('pie')

  const changeType = () => {
    setType((type == 'expense')? 'income' : 'expense')
  }

  const changeGraph = () => {
    setGraph((graph == 'pie')? 'chart' : 'pie')
  }

  const styles = StyleSheet.create({
    ...baseStyles,
    headerButtonTitle: {
      ...baseStyles.headerButtonTitle,
      color: (type == 'expense')? COLORS.error : COLORS.primary,
    }
  })

  const getCategoriesReport = () => {
    return (type == 'expense')
      ? props.report.categories.expenses
      : props.report.categories.incomes
  }

  const getTotal = () => {
    return (type == 'expense')
      ? props.report.expenses
      : props.report.incomes
  }

  const getData = (isLegend = false) => {
    const report = getCategoriesReport()
    let data = []
    if (report && Object.keys(report).length) {
      const total = getTotal()
      for (let [category, value] of Object.entries(report)) {
        if (typeof value == 'number') {
          const percent = Math.round(value / total * 100)
          if (isLegend) {
            data.push({name: category + '\n' + percent + '% - ' + formatCurrency(value)})
          } else{
            data.push({x: category, y:value, label: percent + '%'})
          }
        }
      }
    }
    return data
  }

  const displayChart = () => {

    const data = getData()
    const totalItems = Object.keys(getCategoriesReport()).length

    let chart
    if (data && data.length) {
      chart = (
        <>
          {(graph == 'pie')? (
            <VictoryPie
              data={data}
              theme={VictoryTheme.material}
              colorScale={PALLET}
              innerRadius={80}
            />
          ) : (
            <VictoryChart
              theme={VictoryTheme.material}
              domainPadding={10}
            >
              <VictoryAxis dependentAxis tickFormat={(tick) => {
                return (tick >= 1000)? (tick / 1000) + 'K' : tick
              }} />
              <VictoryBar
                data={data}
                alignment='start'
                labelComponent={<VictoryLabel dy={0} dx={-20} angle={90} />}
                style={{
                  data: { fill: ({ index }) => PALLET[index]},
                }}
              />
            </VictoryChart>
          )}
          <VictoryLegend
            data={getData(true)}
            x={20} y={0}
            height={totalItems * 51}
            colorScale={PALLET}
            orientation='vertical'
            labelComponent={<VictoryLabel />}
            rowGutter={{ top: 0, bottom: 10 }}
            theme={VictoryTheme.material}
            style={{labels: { fontWeight: 'bold' }}}
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

    return chart
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
    height: 350,
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
})

export default ReportCategories