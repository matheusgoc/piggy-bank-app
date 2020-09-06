import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeContext } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { getOnboard } from '../profile/ProfileSlice';
import Onboard from '../profile/Onboard';
import Profile from '../profile/Profile';
import Terms from '../profile/Terms';
import SignIn from '../profile/SignIn';
import Savings from '../profile/Savings';
import Password from '../profile/Password';

export default function Navigation() {

  const RootStack = createStackNavigator();
  const { theme } = useContext(ThemeContext);
  const hasOnboard = useSelector(getOnboard);

  let onboardComponent:any = null;
  if (hasOnboard) {
    onboardComponent = <RootStack.Screen name='Onboard'
                                         component={ Onboard }
                                         options={{
                                           headerShown: false,
                                         }} />
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        { onboardComponent }
        <RootStack.Screen name='SignIn'
                          component={ SignIn }
                          options={{
                            headerShown: false,
                          }} />
        <RootStack.Screen name='Terms'
                          component={ Terms }
                          options={{
                            title: 'Terms of service',
                            headerBackTitleVisible: false,
                            headerTintColor: theme.colors.primary
                          }} />
        <RootStack.Screen name='Profile'
                          component={ Profile }
                          options={{
                            title: 'Create my Profile',
                            headerBackTitleVisible: false,
                            headerTintColor: theme.colors.primary
                          }} />
        <RootStack.Screen name='Savings'
                          component={ Savings }
                          options={{
                            title: 'Plan my Savings',
                            headerBackTitleVisible: false,
                            headerTintColor: theme.colors.primary
                          }} />
        <RootStack.Screen name='Password'
                          component={ Password }
                          options={{
                            title: 'Define my password',
                            headerBackTitleVisible: false,
                            headerTintColor: theme.colors.primary
                          }} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}



