import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import Loading from 'react-native-loading-spinner-overlay'
import { PersistGate } from "redux-persist/integration/react"
import { persistor } from '../../persistor'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import Navigation from './Navigation'
import { LOADING } from '../../constants'
import { isLoading } from './NavigationSlice'

const Persistor = () => {

  const loading = useSelector(isLoading)

  return (
    <>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <ActionSheetProvider>
            <Navigation />
          </ActionSheetProvider>
        </SafeAreaProvider>
      </PersistGate>
      <Loading
        visible={loading}
        textContent={'Loading...'}
        overlayColor={LOADING.overlayColor}
        textStyle={LOADING.textStyle}
        animation={LOADING.animation}
      />
    </>
  )
}

export default Persistor