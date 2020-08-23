import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet } from 'react-native';
import Onboard from './features/onboard/Onboard';
import { ThemeProvider } from 'react-native-elements';
import SignUp from './features/signup/SignUp';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Terms from './features/terms/Terms';
import SignIn from './features/signin/SignIn';

export default function App() {

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen name='Onboard' component={ Onboard } options={{ headerShown: false }} />
          <RootStack.Screen name='Terms'
                            component={ Terms }
                            options={{ headerBackTitleVisible: false, title: 'Terms of service' }} />
          <RootStack.Screen name='SignUp' component={ SignUp } options={{ headerBackTitleVisible: false }} />
          <RootStack.Screen name='SignIn' component={ SignIn } options={{ headerBackTitleVisible: false }} />
        </RootStack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const RootStack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006600',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const theme = {
  colors: {
    primary: '#006600',
    secondary: '#ffffff',
  },
  Button: {
    buttonStyle: {
      borderRadius: 0,
      margin: 0,
      height: 55
    },
  },
};