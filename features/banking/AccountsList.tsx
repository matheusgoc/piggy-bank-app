import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { InstitutionModel } from '../../models/InstitutionModel'
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { Button, Divider, Icon, ListItem } from 'react-native-elements'
import { COLORS, TOAST } from '../../constants'
import BankingServiceApi from '../../services/BankingServiceApi'
import { getInstitutions } from './BankingSlice';
import { showLoading } from '../../helpers';
import { useNavigation } from '@react-navigation/native';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';

const AccountsList = (props) => {

  const navigation = useNavigation()
  const index = props.route.params.index
  const institution: InstitutionModel = useSelector(getInstitutions)[index]
  const [loading, isLoading] = useState(true)
  const [accounts, setAccounts] = useState([])
  const [selectedAccountsCounter, setSelectedAccountsCounter] = useState(0)

  useEffect(() => {

    isLoading(true)
    const bankingServiceApi = new BankingServiceApi()
    bankingServiceApi.getAccounts(institution).then((accounts) => {
      console.log(accounts);
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

  const deleteInstitution = () => {

    showLoading(true)
    const bankingServiceApi = new BankingServiceApi()
    bankingServiceApi.delete(institution, index).then(() => {
      TOAST.ref.alertWithType(
        'success',
        'Remove Institution',
        `The ${institution.name} institution was removed!`,
      );
      navigation.goBack()
    }).catch(error => {
      TOAST.ref.alertWithType(
        'error',
        'Server Error',
        "Unable to remove an institution!",
      );
      console.warn('AccountsList.deleteInstitution: ' + error.message)
    }).finally(() => {
      showLoading(false)
    });
  }

  const handleInstitutionDelete = () => {

    Alert.alert(
      'Remove Institution',
      'Are you sure you want to remove this institution?',
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: deleteInstitution,
        }
      ]
    )
  }

  const selectAccount = (account: AccountModel) => {
    account.checked = !account.checked;
    if (account.checked) {
      setSelectedAccountsCounter(selectedAccountsCounter + 1)
    } else {
      setSelectedAccountsCounter(selectedAccountsCounter - 1)
    }
  }

  const showTransactions = () => {

    const selectedAccounts = accounts
      .filter((account: AccountModel) => account.checked)
      .map((account: AccountModel) => account.id)
      .join(',')

    console.log(selectedAccounts);
  }

  const renderAccountItem = (account: AccountModel, index) => (
    <ListItem bottomDivider onPress={() => {selectAccount(account)}}>
      <ListItem.CheckBox checked={account.checked} onPress={() => selectAccount(account)} />
      <ListItem.Content>
        <ListItem.Title>{account.name}</ListItem.Title>
        <ListItem.Subtitle>{account.subtype}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Subtitle>{account.mask}</ListItem.Subtitle>
    </ListItem>
  )

  const emptyState = (
    <View style={styles.empty}>
      <Icon
        name='exclamation-triangle'
        type='font-awesome'
        size={50}
        color={COLORS.gray}
      />
      <Text style={styles.emptyText}>
        No accounts!
      </Text>
    </View>
  )

  const placeholder = Array(5).fill('').map((value, index) => (
    <ListItem topDivider={index > 0}>
      <ContentLoader
        speed={.5}
        width={300}
        height={60}
        viewBox="0 0 300 60"
        backgroundColor="#f3f3f3"
        foregroundColor="#d4d4d4">
        <Rect x="10" y="20" rx="3" ry="3" width="20" height="20" />
        <Rect x="59" y="13" rx="3" ry="3" width="200" height="10" />
        <Rect x="60" y="35" rx="3" ry="3" width="100" height="10" />
      </ContentLoader>
    </ListItem>
  ));

  const list = (
    <>
      <View style={styles.list}>
        <View style={styles.listTitle}>
          <Text style={styles.listTitleLabel}>
            Select the accounts which you want to check the transactions:
          </Text>
        </View>
        <Divider />
        <View style={styles.listContainer}>
          {(loading)? placeholder : (
            <FlatList
              data={accounts}
              renderItem={({item, index}) => renderAccountItem(item, index)}
              keyExtractor={item => item.id}
            />
          )}
        </View>
      </View>
      <Button
        title="Show Transactions"
        containerStyle={styles.listButton}
        disabled={selectedAccountsCounter <= 0}
        onPress={showTransactions}
      />
    </>
  )

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Button
            onPress={() => {navigation.goBack()}}
            icon={{name: 'arrow-back-ios', type: 'material', color: COLORS.primary, size: 30}}
            type='clear'
          />
          <View style={styles.headerTitle}>
            <Icon name='university' type='font-awesome-5' color={COLORS.gray} size={30} />
            <Text style={styles.headerTitleText}>{institution?.name}</Text>
          </View>
          <Button
            onPress={handleInstitutionDelete}
            icon={{name: 'delete-forever', type: 'material', color: COLORS.error, size: 30}}
            type='clear'
          />
        </View>
        <Divider />
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
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingBottom: 100,
  },
  emptyText: {
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: 'bold',
    paddingTop: 10,
  },
  list: {
    marginBottom: 130,
  },
  listContainer: {
    height: '90%',
  },
  listTitle: {
    height: '10%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  listTitleLabel: {
    fontSize: 15,
    color: COLORS.primary,
  },
  listButton: {
    position: 'absolute',
    alignSelf: 'center',
    width: '80%',
    bottom: 10,
  },
})

export default AccountsList