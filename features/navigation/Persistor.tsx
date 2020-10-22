import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Loading from 'react-native-loading-spinner-overlay';
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from '../../persistor';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import Navigation from './Navigation';
import { COLORS, LOADING, TOAST } from '../../constants';
import DropdownAlert from 'react-native-dropdownalert';
import { isLoading } from './NavigationSlice';
import { StatusBar } from 'react-native';

const Persistor = () => {

  const loading = useSelector(isLoading);

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
      <DropdownAlert
        ref={ref => TOAST.ref = ref}
        inactiveStatusBarBackgroundColor={COLORS.secondary}
        inactiveStatusBarStyle='dark-content'
        showCancel={true}
      />
      <StatusBar backgroundColor={COLORS.secondary} barStyle='dark-content' />
    </>
  )
}

export default Persistor