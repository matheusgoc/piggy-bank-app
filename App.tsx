import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from 'react-native-elements';
import { THEME } from './constants';
import Persistor from './features/navigation/Persistor';

const App = () => {

  return (
    <ThemeProvider theme={THEME}>
      <Provider store={store}>
        <Persistor />
      </Provider>
    </ThemeProvider>
  );
}

export default App;