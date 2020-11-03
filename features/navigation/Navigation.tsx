import React from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { COLORS } from '../../constants';
import { getToken, hasOnboard } from '../profile/ProfileSlice';
import Onboard from '../profile/Onboard';
import Profile from '../profile/Profile';
import Terms from '../profile/Terms';
import SignIn from '../profile/SignIn';
import Savings from '../profile/Savings';
import Password from '../profile/Password';
import Main from './Main';
import Transaction from '../transactions/Transaction';
import TransactionsView from '../transactions/TransactionsView';
import ResetPasswordEmail from '../profile/ResetPasswordEmail';
import ResetPasswordPIN from '../profile/ResetPasswordPIN';
enableScreens();

const Navigation = () => {

  const onboard = useSelector(hasOnboard);
  const token = useSelector(getToken);

  const RootStack = createStackNavigator();
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
        options={{
          title: 'Terms of service',
          headerBackTitleVisible: false,
          headerTintColor: COLORS.primary
        }}
      />
    ),
    profile: (
      <RootStack.Screen
        name='Profile'
        component={ Profile }
        options={{
          title: 'Create my Profile',
          headerBackTitleVisible: false,
          headerTintColor: COLORS.primary
        }}
      />
    ),
    savings: (
      <RootStack.Screen
        name='Savings'
        component={ Savings }
        options={{
          title: 'Plan my Savings',
          headerBackTitleVisible: false,
          headerTintColor: COLORS.primary
        }}
      />
    ),
    password: (
      <RootStack.Screen
        name='Password'
        component={ Password }
        options={{
          title: 'Define my password',
          headerBackTitleVisible: false,
          headerTintColor: COLORS.primary
        }}
      />
    ),
    resetPasswordEmail: (
      <RootStack.Screen
        name='ResetPasswordEmail'
        component={ ResetPasswordEmail }
        options={{
          title: 'Reset my password',
          headerBackTitleVisible: false,
          headerTintColor: COLORS.primary
        }}
      />
    ),
    resetPasswordPIN: (
      <RootStack.Screen
        name='ResetPasswordPIN'
        component={ ResetPasswordPIN }
        options={{
          title: 'Reset my password',
          headerBackTitleVisible: false,
          headerTintColor: COLORS.primary
        }}
      />
    ),
    transactions: {
      add: (
        <RootStack.Screen
          name='Transaction'
          component={ Transaction }
          options={{
            title: 'Add Transaction',
            headerBackTitleVisible: false,
            headerTintColor: COLORS.primary,
          }}
        />
      ),
      edit: (
        <RootStack.Screen
          name='TransactionEdit'
          component={ Transaction }
          options={{
            title: 'Edit Transaction',
            headerBackTitleVisible: false,
            headerTintColor: COLORS.primary,
          }}
        />
      ),
      view: (
        <RootStack.Screen
          name='TransactionView'
          component={ TransactionsView }
          options={{
            title: 'View Transaction',
            headerBackTitleVisible: false,
            headerTintColor: COLORS.primary,
          }}
        />
      ),
    }
  }

  return (
    <>
      <NavigationContainer>
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
            ) : (
              <>
                { features.signIn }
                { features.terms }
                { features.profile }
                { features.savings }
                { features.password }
                { features.resetPasswordEmail }
                { features.resetPasswordPIN }
              </>
            )
          }
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  )
}

export default Navigation;