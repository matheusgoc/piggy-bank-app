import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { InstitutionModel } from '../../models/InstitutionModel'
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native'
import { Button, ListItem } from 'react-native-elements'
import { COLORS, TOAST } from '../../constants'
import BankingServiceApi from '../../services/BankingServiceApi'
import { AccountModel } from '../../models/AccountModel';
import { getInstitutionIndex, getInstitutions } from './BankingSlice'
import { useNavigation } from '@react-navigation/native'
import AccountListPlaceholder from '../../components/banking/AccountListPlaceholder'
import BankingHeader from '../../components/banking/BankingHeader'
import BankingListLabel from '../../components/banking/BankingListLabel'
import BankingEmptyState from '../../components/banking/BankingEmptyState';

const AccountsList = () => {

  const navigation = useNavigation()
  const institutionIndex = useSelector(getInstitutionIndex)
  const institution: InstitutionModel = useSelector(getInstitutions)[institutionIndex]
  const [loading, isLoading] = useState(true)
  const [accounts, setAccounts] = useState([])
  const [selectedAccountsCounter, setSelectedAccountsCounter] = useState(0)

  useEffect(() => {

    isLoading(true)
    const bankingServiceApi = new BankingServiceApi()
    bankingServiceApi.getAccounts(institution).then((accounts) => {
      setAccounts(accounts);
    }).catch(() => {
      TOAST.ref.alertWithType(
        'error',
        'Load accounts error',
        "Unable to retrieve the institution's accounts from the server"
      )
    }).finally(() => {
      isLoading(false)
    })
  }, [])

  const selectAccount = (account: AccountModel) => {
    account.checked = !account.checked;
    if (account.checked) {
      setSelectedAccountsCounter(selectedAccountsCounter + 1)
    } else {
      setSelectedAccountsCounter(selectedAccountsCounter - 1)
    }
  }

  const next = () => {

    const selectedAccounts = accounts
      .filter((account: AccountModel) => account.checked)
      .map((account: AccountModel) => account.id)
      .join(',')

    navigation.navigate('BankingCalendar', {
      accounts: selectedAccounts
    })
  }

  const renderAccountItem = (account: AccountModel) => (
    <ListItem bottomDivider onPress={() => {selectAccount(account)}}>
      <ListItem.CheckBox checked={account.checked} onPress={() => selectAccount(account)} />
      <ListItem.Content>
        <ListItem.Title>{account.name}</ListItem.Title>
        <ListItem.Subtitle>{account.subtype}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Subtitle>{account.mask}</ListItem.Subtitle>
    </ListItem>
  )

  const emptyState = (<BankingEmptyState message="No accounts!" />)

  const placeholder = Array(5).fill('').map((value, index) => (
    <AccountListPlaceholder index={index} />
  ));

  const list = (
    <>
      <View style={styles.list}>
        <BankingListLabel label="Select the accounts which you want to import the transactions:" />
        <View style={styles.listContainer}>
          {(loading)? placeholder : (
            <FlatList
              data={accounts}
              renderItem={({item}) => renderAccountItem(item)}
              keyExtractor={item => item.id}
              ListFooterComponent={<View style={{height: 100}} />}
            />
          )}
        </View>
      </View>
      <View style={styles.btnGroup}>
        <Button
          title="Next"
          containerStyle={styles.btn}
          disabled={selectedAccountsCounter <= 0}
          onPress={next}
        />
      </View>

    </>
  )

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <BankingHeader />
        {(!loading && accounts.length === 0)? emptyState : list}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    maxWidth: 200,
    paddingLeft: 10,
    fontSize: 25,
  },
  list: {
    marginBottom: 130,
  },
  listContainer: {
    height: '90%',
  },
  btnGroup: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    paddingBottom: 10,
    backgroundColor: COLORS.secondary,
  },
  btn: {
    alignSelf: 'center',
    width: '85%',
  }
})

export default AccountsList