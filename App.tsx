import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import { ThemeProvider } from 'react-native-elements'
import { COLORS, THEME, TOAST } from './constants'
import Persistor from './features/navigation/Persistor'
import DropdownAlert from 'react-native-dropdownalert'
import { StatusBar } from 'react-native'

const App = () => {

  return (
    <ThemeProvider theme={THEME}>
      <Provider store={store}>
        <Persistor />
      </Provider>
      <DropdownAlert
        ref={ref => TOAST.ref = ref}
        inactiveStatusBarBackgroundColor={COLORS.secondary}
        inactiveStatusBarStyle='dark-content'
        showCancel={true}
      />
      <StatusBar backgroundColor={COLORS.secondary} barStyle='dark-content' />
    </ThemeProvider>
  );
}

export default App