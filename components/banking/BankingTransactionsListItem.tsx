import React from 'react'
import { BankingTransactionModel } from '../../models/BankingTransactionModel'
import moment from 'moment'
import { formatCurrency } from '../../helpers'
import { Avatar, Icon, ListItem } from 'react-native-elements'
import { StyleSheet, Text, View } from 'react-native'
import { COLORS } from '../../constants'

interface BankingListItemProps {
  transaction: BankingTransactionModel
  onPress(transaction: BankingTransactionModel): void
}

const BankingTransactionsListItem = ({transaction, onPress}: BankingListItemProps) => {
  const date = moment(transaction.date, 'YYYY-MM-DD').format('MMM[\n]DD')
  const amount = formatCurrency(transaction.amount)

  const styles = StyleSheet.create({
    ...baseStyles,
    amount: {
      ...baseStyles.amount,
      color: (transaction.amount > 0)? COLORS.success : COLORS.error
    }
  })

  return (
    <ListItem bottomDivider onPress={() => onPress(transaction)}>
      <Avatar
        size='medium'
        rounded
        title={date}
        containerStyle={styles.dateContainer}
        titleStyle={styles.date}
      />
      <ListItem.Content>
        <ListItem.Title style={styles.categories}>
          {transaction.name}
        </ListItem.Title>
        <ListItem.Subtitle>
          {transaction.categories.join(', ')}
        </ListItem.Subtitle>
      </ListItem.Content>
      <View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>{amount}</Text>
          <Icon
            name={(transaction.amount > 0)? 'caret-up' : 'caret-down'}
            color={(transaction.amount > 0)? COLORS.success : COLORS.error}
            type='font-awesome'
          />
        </View>
      </View>
    </ListItem>
  )
}

const baseStyles = StyleSheet.create({
  dateContainer: {
    borderWidth: 2,
  },
  date: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  categories: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amountContainer: {
    flexDirection:'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  amount: {
    fontSize: 17,
    fontWeight: 'bold',
    paddingRight: 5,
  },
  time: {
    fontWeight: 'bold',
    textAlign: 'right',
  },
})

export default BankingTransactionsListItem