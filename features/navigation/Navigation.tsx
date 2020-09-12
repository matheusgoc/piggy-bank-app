import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeContext } from 'react-native-elements';
import { useSelector } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import Loading from 'react-native-loading-spinner-overlay';
import { isLoading } from './NavigationSlice';
import { hasOnboard, hasToken } from '../profile/ProfileSlice';
import Onboard from '../profile/Onboard';
import Profile from '../profile/Profile';
import Terms from '../profile/Terms';
import SignIn from '../profile/SignIn';
import Savings from '../profile/Savings';
import Password from '../profile/Password';
import Main from './Main';
import { LOADING, TOAST } from '../../constants';

const Navigation = () => {

  const RootStack = createStackNavigator();
  const { theme } = useContext(ThemeContext);

  const loading = useSelector(isLoading);
  const onboard = useSelector(hasOnboard);
  const token = useSelector(hasToken);

  return (
    <>
      <NavigationContainer>
        <RootStack.Navigator>
          {(onboard)
            ? <RootStack.Screen name='Onboard'
                                component={ Onboard }
                                options={{
                                  headerShown: false,
                                }} />
            : null
          }
          {(token)
            ? <RootStack.Screen name='Main'
                                component={ Main }
                                options={{
                                  headerShown: false,
                                }} />
            : null
          }
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
      <Loading
        visible={loading}
        textContent={'Loading...'}
        overlayColor={LOADING.overlayColor}
        textStyle={LOADING.textStyle}
        animation={LOADING.animation}
      />
      <DropdownAlert ref={ref => TOAST.ref = ref} />
    </>
  )
}

export default Navigation;