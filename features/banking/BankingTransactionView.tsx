import React from 'react'
import { BankingTransactionModel } from '../../models/BankingTransactionModel'
import BankingHeader from '../../components/banking/BankingHeader'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import moment from 'moment'
import { formatCurrency } from '../../helpers';
import { Card, ListItem } from 'react-native-elements';
import { COLORS } from '../../constants';
import { TransactionModel } from '../../models/TransactionModel';
import { useNavigation } from '@react-navigation/native';

interface BankingTransactionProps {
  route: {
    params: {
      transaction
    }
  }
}

const BankingTransactionView = (props: BankingTransactionProps) => {
  const navigation = useNavigation()
  const transaction: BankingTransactionModel = JSON.parse(props.route.params.transaction)
  const categories = [...transaction.categories, '']

  const styles = StyleSheet.create({
    ...baseStyles,
    amount: {
      ...baseStyles.amount,
      color: (transaction.amount > 0)? COLORS.success : COLORS.error
    }
  })

  const addTransaction = (category: string) => {
    const date = moment(transaction.date, 'YYYY-MM-DD')
    const newTransaction: TransactionModel = {
      id: null,
      amount: Math.abs(transaction.amount),
      place: transaction.name,
      category: (category == 'new')? null : {
        id: null,
        isNew: true,
        name: category,
      },
      isOwner: true,
      currency: transaction.currency,
      currencyExchange: null,
      type: (transaction.amount > 0)? 'I' : 'E',
      orderDate: date.toDate(),
      orderTime: null,
      timestamp: null,
      description: null,
      isNewReceipt: false,
      isReceiptRemoved: false,
      receipt: null,
      key: null,
    }
    navigation.navigate('Transaction', {
      transaction: JSON.stringify(newTransaction),
      backView: 'BankingTransactionsList',
    })
  }

  const CategoryItem = (category: string, index: number) => (
    <ListItem
      key={index}
      underlayColor={COLORS.primary}
      onPress={() => addTransaction(category)}
      bottomDivider>
      <ListItem.Content>
        <ListItem.Title>
          <Text style={styles.categoryText}>{(category == '')? 'Other' : category}</Text>
        </ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  )

  return (
    <SafeAreaView style={styles.main}>
      <BankingHeader />
      <View style={styles.container}>
        <View style={styles.dataContainer}>
          <Text style={styles.name}>{transaction.name}</Text>
          <Text style={styles.date}>{moment(transaction.date, 'YYYY-MM-DD').format('MMM DD, YYYY')}</Text>
        </View>
        <Text style={styles.amount}>{formatCurrency(transaction.amount)}</Text>
        <Card containerStyle={styles.categories}>
          <Card.Title style={styles.categoriesTitle}>
            Choose the category that best fits for this transaction:
          </Card.Title>
          {categories.map(CategoryItem)}
        </Card>
      </View>
    </SafeAreaView>
  )
}

const baseStyles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.secondary,
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  dataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 16,
    color: COLORS.gray,
  },
  amount: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  categories: {
    padding: 0,
  },
  categoriesTitle: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 0,
    fontWeight: 'normal',
    textAlign: 'left',
  },
  categoryText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  }
});

export default BankingTransactionView