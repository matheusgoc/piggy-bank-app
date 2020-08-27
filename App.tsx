import 'react-native-gesture-handler';
import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store';
import { ThemeProvider } from 'react-native-elements';
import Navigation from './features/navigation/Navigation';

const App = () => {

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}

const primaryColor = '#006600';
const secondaryColor = '#ffffff';
const theme = {
  colors: {
    primary: primaryColor,
    secondary: secondaryColor,
  },
  Button: {
    buttonStyle: {
      borderRadius: 0,
      margin: 0,
      height: 55,

    },
  },
  Input: {
    inputContainerStyle: {
      borderColor: primaryColor,
      borderWidth: 2,
      borderBottomColor: primaryColor,
      borderBottomWidth: 2,
      paddingLeft: 10,
    },
    labelStyle: {
      color: primaryColor,
    }
  }
};

export default App;