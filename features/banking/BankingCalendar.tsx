import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { CalendarList } from 'react-native-calendars'
import BankingHeader from '../../components/banking/BankingHeader'
import BankingListLabel from '../../components/banking/BankingListLabel'
import { Button } from 'react-native-elements'
import { COLORS } from '../../constants'
import moment, { Moment } from 'moment'
import { useNavigation } from '@react-navigation/native';

interface CalendarObject {
  day: number,       // day of month (1-31)
  month: number,     // month of year (1-12)
  year: number,      // year
  timestamp: number, // UTC timestamp representing 00:00 AM of this date
  dateString: string // date formatted as 'YYYY-MM-DD' string
}

const BankingCalender = (props) => {

  const navigation = useNavigation()
  const accounts: string = props.route.params.accounts
  const [calendarPeriod, setPeriod] = useState({})
  const [hasPick, setPick] = useState(false)

  const generatePeriod = (date1: Moment, date2: Moment) => {

    const period = {}
    const totalDays = date2.diff(date1, 'days')
    for (let i = 0; i <= totalDays; i++) {
      period[date1.format('YYYY-MM-DD')] = {
        color: COLORS.primary,
        textColor: COLORS.secondary,
        startingDay: i == 0 || date1.isSame(date1.clone().startOf('month'), 'day'),
        endingDay: i == totalDays || date1.isSame(date1.clone().endOf('month'), 'day'),
      }
      date1.add(1, 'd')
    }
    setPeriod(period)
  }

  const handleCalendar = ((day: CalendarObject) => {

    const days = Object.keys(calendarPeriod)

    // one day selected only
    if (days.length == 1) {

      // same unique day selected
      if (day.dateString == days[0]) {
        return;
      }

      //set period range
      const date1 = moment(day.dateString, 'YYYY-MM-DD')
      const date2 = moment(days[0], 'YYYY-MM-DD')
      if (date1.isBefore(date2)) {
        generatePeriod(date1, date2)
      } else {
        generatePeriod(date2, date1)
      }

    // no day or more then one day selected
    } else {

      // reset period
      let period = {}
      period[day.dateString] = {
        color: COLORS.primary,
        textColor: COLORS.secondary,
        startingDay: true,
        endingDay: true
      }
      setPeriod(period)
    }

    setPick(true)
  })

  const next = () => {
    const period = Object.keys(calendarPeriod);
    const start = period[0];
    const end = period[period.length - 1];
    navigation.navigate('BankingTransactionsList', {accounts, start, end})
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <BankingHeader />
        <BankingListLabel label="Pick one day or more to list the transactions:" />
        <CalendarList style={styles.calendar}
          onDayPress={handleCalendar}
          pastScrollRange={23}
          futureScrollRange={1}
          scrollEnabled={true}
          markingType={'period'}
          markedDates={calendarPeriod}
        />
        <View style={styles.btnGroup}>
          <Button
            title="Show Transactions"
            containerStyle={styles.btn}
            onPress={next}
            disabled={!hasPick}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.secondary,
  },
  container: {
    height: '100%',
  },
  calendar: {
    height: '75%',
  },
  btnGroup: {
    position: 'absolute',
    width: '100%',
    height: '5%',
    bottom: 0,
    paddingBottom: 10,
    backgroundColor: COLORS.secondary,
  },
  btn: {
    alignSelf: 'center',
    width: '80%',
  }
})

export default BankingCalender
