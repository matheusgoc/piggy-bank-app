import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { store } from './store';
import { persistor } from './persistor';
import { ThemeProvider } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './features/navigation/Navigation';
import { THEME } from './constants';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const App = () => {

  return (
    <ThemeProvider theme={THEME}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <ActionSheetProvider>
              <Navigation />
            </ActionSheetProvider>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}

export default App;