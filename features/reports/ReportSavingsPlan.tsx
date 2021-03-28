import React from 'react'
import { StyleSheet, Text, useWindowDimensions, View } from "react-native"
import { useSelector } from 'react-redux'
import { Icon } from 'react-native-elements'
import * as Progress from 'react-native-progress'
import { COLORS } from '../../constants'
import { formatCurrency } from '../../helpers'
import { ReportModel } from '../../models/ReportModel'
import { getGeneralReport, getMonthlyReport } from './ReportsSlice'
import { getSavings } from '../profile/ProfileSlice'
import { ProfileSavingsModel } from '../../models/ProfileSavingsModel'

const ReportSavingsPlan = () => {

  const windowWidth = useWindowDimensions().width
  const savingsTarget: ProfileSavingsModel = useSelector(getSavings)
  const generalReport: ReportModel = useSelector(getGeneralReport)
  const monthlyReport: ReportModel = useSelector(getMonthlyReport)

  const calcMonthlyTargetReached = () => {
    const incomes: number = monthlyReport.incomes ?? 0
    const expenses: number = monthlyReport.expenses ?? 0
    const total = incomes - expenses
    return (total < 0)? 0 : total
  }

  const percentMonthlyTargetReached = () => {
    const targetMonthlySavings = savingsTarget.targetMonthlySavings ?? 0
    const percent = (targetMonthlySavings)? calcMonthlyTargetReached() / targetMonthlySavings : 0
    return (percent > 1)? 1 : percent
  }

  const calcTotalTargetReached = () => {
    const incomes: number = generalReport.incomes ?? 0
    const expenses: number = generalReport.expenses ?? 0
    const total = incomes - expenses
    return (total < 0)? 0 : total
  }

  const percentTotalTargetReached = () => {
    const targetMonthlySavings = savingsTarget.targetMonthlySavings ?? 0
    const percent = (targetMonthlySavings)? calcTotalTargetReached() / targetMonthlySavings : 0
    return (percent > 1)? 1 : percent
  }

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Icon name='bullseye' type={'font-awesome'} color={COLORS.primary} />
        <Text style={styles.titleText}>Savings Plan</Text>
      </View>
      <View style={styles.targets}>
        <View style={[styles.target, styles.monthlyTarget]}>
          <Text style={styles.textLeft}>Monthly Target</Text>
          <View style={styles.progress}>
            <Text>{formatCurrency(savingsTarget.targetMonthlySavings)}</Text>
            <Progress.Bar
              color={COLORS.primary}
              progress={percentMonthlyTargetReached()}
              width={windowWidth * 0.35}
              height={15}
            />
          </View>
          <Text style={styles.textRight}>
            {formatCurrency(calcMonthlyTargetReached())}
          </Text>
        </View>
        <View style={[styles.target, styles.totalTarget]}>
          <Text style={styles.textLeft}>Total Target</Text>
          <View style={styles.progress}>
            <Progress.Bar
              color={COLORS.primary}
              progress={percentTotalTargetReached()}
              width={windowWidth * 0.35}
              height={15}
            />
            <Text>{formatCurrency(savingsTarget.targetTotalSavings)}</Text>
          </View>
          <Text style={styles.textRight}>
            {formatCurrency(calcTotalTargetReached())}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.primary,
    paddingLeft: 5,
  },
  targets: {
    width: '100%',
    alignItems: 'center',
    // backgroundColor: 'blue',
  },
  target: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 3,
  },
  monthlyTarget: {
    alignItems: 'flex-end',
  },
  totalTarget: {
    alignItems: 'flex-start',
  },
  textRight: {
    width: '30%',
    textAlign: 'left',
  },
  textLeft: {
    width: '30%',
    textAlign: 'right',
  },
  progress: {
    width: '40%',
    alignItems: 'center',
  },
})

export default ReportSavingsPlan