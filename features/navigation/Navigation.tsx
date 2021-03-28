import React from 'react'
import { enableScreens } from 'react-native-screens'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { COLORS } from '../../constants'
import { getToken, hasOnboard } from '../profile/ProfileSlice'
import Onboard from '../profile/Onboard'
import Profile from '../profile/Profile'
import Terms from '../profile/Terms'
import SignIn from '../profile/SignIn'
import Savings from '../profile/Savings'
import Password from '../profile/Password'
import Main from './Main'
import Transaction from '../transactions/Transaction'
import TransactionsView from '../transactions/TransactionsView'
import ResetPasswordEmail from '../profile/ResetPasswordEmail'
import ResetPasswordPIN from '../profile/ResetPasswordPIN'
import { RootNavigation } from '../../helpers'
import AddInstitution from '../banking/AddInstitution'
import AccountsList from '../banking/AccountsList'
import BankingCalendar from '../banking/BankingCalendar'
import BankingTransactionsList from '../banking/BankingTransactionsList'
import BankingTransactionView from '../banking/BankingTransactionView'
import { StyleSheet } from 'react-native'
enableScreens()

const Navigation = () => {

  const onboard = useSelector(hasOnboard)
  const token = useSelector(getToken)

  const RootStack = createStackNavigator()
  const features = {
    main: (
      <RootStack.Screen
        name='Main'
        component={ Main }
        options={{
          headerShown: false,
        }}
      />
    ),
    onboard: (
      <RootStack.Screen
        name='Onboard'
        component={ Onboard }
        options={{
          headerShown: false,
        }}
      />
    ),
    signIn: (
      <RootStack.Screen
        name='SignIn'
        component={ SignIn }
        options={{
          headerShown: false,
        }}
      />
    ),
    terms: (
      <RootStack.Screen
        name='Terms'
        component={ Terms }
        options={getOptions('Terms of service')}
      />
    ),
    profile: (
      <RootStack.Screen
        name='Profile'
        component={ Profile }
        options={getOptions('Create my Profile')}
      />
    ),
    savings: (
      <RootStack.Screen
        name='Savings'
        component={ Savings }
        options={getOptions('Plan my Savings')}
      />
    ),
    password: (
      <RootStack.Screen
        name='Password'
        component={ Password }
        options={getOptions('Define my password')}
      />
    ),
    resetPasswordEmail: (
      <RootStack.Screen
        name='ResetPasswordEmail'
        component={ ResetPasswordEmail }
        options={getOptions('Reset my password')}
      />
    ),
    resetPasswordPIN: (
      <RootStack.Screen
        name='ResetPasswordPIN'
        component={ ResetPasswordPIN }
        options={getOptions('Reset my password')}
      />
    ),
    transactions: {
      add: (
        <RootStack.Screen
          name='Transaction'
          component={ Transaction }
          options={getOptions('Add Transaction')}
        />
      ),
      edit: (
        <RootStack.Screen
          name='TransactionEdit'
          component={ Transaction }
          options={getOptions('Edit Transaction')}
        />
      ),
      view: (
        <RootStack.Screen
          name='TransactionView'
          component={ TransactionsView }
          options={getOptions('View Transaction')}
        />
      ),
    },
    banking: {
      addInstitution: (
        <RootStack.Screen
          name='AddInstitution'
          component={ AddInstitution }
          options={getOptions('Add Institution')}
        />
      ),
      accountsList: (
        <RootStack.Screen
          name='AccountsList'
          component={ AccountsList }
          options={{
            headerShown: false,
          }}
        />
      ),
      calendar: (
        <RootStack.Screen
          name='BankingCalendar'
          component={ BankingCalendar }
          options={{
            headerShown: false,
          }}
        />
      ),
      transactionsList: (
        <RootStack.Screen
          name='BankingTransactionsList'
          component={ BankingTransactionsList }
          options={{
            headerShown: false,
          }}
        />
      ),

      transactionView: (
        <RootStack.Screen
          name='BankingTransactionView'
          component={ BankingTransactionView }
          options={{
            headerShown: false,
          }}
        />
      ),
    },
  }

  return (
    <>
      <NavigationContainer ref={RootNavigation.navigationRef}>
        <RootStack.Navigator>
          { (onboard && !token) ? features.onboard : null }
          { (token)
            ? (
              <>
                { features.main }
                { features.transactions.add }
                { features.transactions.edit }
                { features.transactions.view }
              </>
            ) : null
          }
          { features.signIn }
          { features.resetPasswordEmail }
          { features.terms }
          { features.profile }
          { features.savings }
          { features.password }
          { features.resetPasswordPIN }
          { features.banking.addInstitution }
          { features.banking.accountsList }
          { features.banking.calendar }
          { features.banking.transactionsList }
          { features.banking.transactionView }
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  )
}

const getOptions = (title) => {
  return {
    title: title,
    headerBackTitleVisible: false,
    headerTintColor: COLORS.primary,
    headerTitleStyle: styles.title,
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  }
})

export default Navigation