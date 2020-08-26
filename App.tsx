import 'react-native-gesture-handler';
import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store';
import { ThemeProvider } from 'react-native-elements';
import Navigation from './features/navigation/Navigation';

export default function App() {

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