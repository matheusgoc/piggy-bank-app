import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { InstitutionModel } from '../../models/InstitutionModel'
import { ActivityIndicator, SafeAreaView, SectionList, StyleSheet, Text, View } from 'react-native'
import { COLORS, TOAST } from '../../constants'
import BankingServiceApi from '../../services/BankingServiceApi'
import { getInstitutionIndex, getInstitutions } from './BankingSlice'
import { useNavigation } from '@react-navigation/native'
import BankingHeader from '../../components/banking/BankingHeader'
import BankingListLabel from '../../components/banking/BankingListLabel'
import BankingEmptyState from '../../components/banking/BankingEmptyState'
import TransactionListPlaceholder from '../../components/transaction-list-item/TransactionListPlaceholder'
import { BankingTransactionModel } from '../../models/BankingTransactionModel'
import moment from 'moment'
import BankingTransactionsListItem from '../../components/banking/BankingTransactionsListItem';

interface BankingTransactionsListProps {
  route: {
    params: {
      accounts: string,
      start: string,
      end: string,
    }
  }
}

const BankingTransactionsList = (props: BankingTransactionsListProps) => {

  const navigation = useNavigation()
  const params = props.route.params
  const institutionIndex = useSelector(getInstitutionIndex)
  const institution: InstitutionModel = useSelector(getInstitutions)[institutionIndex]

  const [loadingPlaceholder, setLoadingPlaceholder] = useState(true)
  const [loading, setLoading] = useState(false)
  const [stopLoading, setStopLoading] = useState(false)

  const [transactionsList, setTransactionsList] = useState([])
  const [page, setPage] = useState(1)
  const listRef = useRef<SectionList>(null);

  useEffect(() => loadTransactions(), [])

  const loadTransactions = () => {

    // cancel if it is still loading a previous request or if it has been set to no load anymore
    if (loading || stopLoading) {
      return
    }

    setLoading(true)
    const bankingServiceApi = new BankingServiceApi()
    bankingServiceApi.getTransactions(
      institution, params.start, params.end, params.accounts, page
    ).then((transactions) => {

      // pass by it if there is no more transactions and set to not loading anymore
      if (transactions.length == 0) {
        setStopLoading(true)
        return
      }

      // group transactions by year {year:[transactions]}
      const yearsList = {}
      transactions.forEach((transaction) => {

        // invert transaction amount signal
        transaction.amount = -transaction.amount

        // get the transaction's year
        const transactionYear = moment(transaction.date, 'YYYY-MM-DD').format('YYYY')

        // Add the transaction's year
        if (!Object.keys(yearsList).some((year) => transactionYear == year)) {
          yearsList[transactionYear] = []
        }
        yearsList[transactionYear].push(transaction)
      })

      // aggregates the previous list
      let years = Object.keys(yearsList).reverse()
      transactionsList.forEach((group) => {
        if (years.indexOf(group.title) >= 0) {
          yearsList[group.title] = [...group.data,...yearsList[group.title]]
        } else {
          yearsList[group.title] = [...group.data]
        }
      })

      // change the object list to array to feed the SectionsList component [{title: year, data: transactions}]
      years = Object.keys(yearsList).reverse()
      const list = years.map((year) => {
        return {
          title: year,
          data: yearsList[year],
        }
      })

      // set the list state
      setTransactionsList(list)
      setPage(page + 1)

    }).catch((error) => {
      TOAST.ref.alertWithType(
        'error',
        'Load transactions error',
        "Unable to retrieve the institution's transactions from the server"
      )
      console.error(error)
    }).finally(() => {
      setLoadingPlaceholder(false)
      setLoading(false)
    })
  }

  const selectTransaction = (transaction: BankingTransactionModel) => {
    navigation.navigate('BankingTransactionView', {transaction: JSON.stringify(transaction)})
  }

  const renderTransactionItem = (transaction: BankingTransactionModel) => {
    return (
      <BankingTransactionsListItem
        transaction={transaction}
        onPress={selectTransaction}
      />
    )
  }

  const placeholder = Array(20).fill('').map((value, index) => (
    <TransactionListPlaceholder index={index} />
  ))

  const list = (
    <View style={styles.list}>
      <BankingListLabel label="Select the transaction you want to add:" />
      <View style={styles.listContainer}>
        {(loadingPlaceholder)? placeholder : (
          <SectionList
            ref={listRef}
            sections={transactionsList}
            renderItem={({item}) => renderTransactionItem(item)}
            keyExtractor={item => item.id}
            stickySectionHeadersEnabled={true}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.section}>
                <Text style={styles.sectionText}>{title}</Text>
              </View>
            )}
            ListFooterComponent={(stopLoading)?
              <Text style={styles.stopLoadingText}>No more transactions to load!</Text> :
              <ActivityIndicator size='large' color={COLORS.primary} style={{margin: 20}} />
            }
            onEndReached={loadTransactions}
          />
        )}
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <BankingHeader />
        {(!loading && transactionsList.length == 0)? <BankingEmptyState message="No transactions!" /> : list}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.secondary,
  },
  container: {
    height: '100%'
  },
  list: {
    height: '100%',
  },
  listContainer: {
    height: '80%',
  },
  section: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 100,
    paddingVertical: 1,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  sectionText: {
    color: COLORS.secondary,
    borderRadius: 100,
    fontSize: 16,
    fontWeight: 'bold',
  },
  stopLoadingText: {
    margin: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  }
})

export default BankingTransactionsList