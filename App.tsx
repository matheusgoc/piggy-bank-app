import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './store';
import { ThemeProvider } from 'react-native-elements';
import Navigation from './features/navigation/Navigation';
import { THEME } from './constants';

const App = () => {

  return (
    <ThemeProvider theme={THEME}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}

export default App;