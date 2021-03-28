import 'intl'
import 'intl/locale-data/jsonp/en'
import React from 'react'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import { store } from './store'
import { setLoading } from './features/navigation/NavigationSlice'

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en: {
    currencyThousandsSeparator: ',',
    currencyDecimalSeparator: '.',
  },
  'pt-BR': {
    currencyThousandsSeparator: '.',
    currencyDecimalSeparator: ',',
  },
}

// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true

export const trans = key => i18n.t(key)

export const showLoading = (isLoading: boolean): void => {

  store.dispatch(setLoading(isLoading))
}

export const formatCurrency = (number: number|string) => {
  if (typeof number == 'string') {
    number = Number(unformatCurrency(number))
  }

  return new Intl.NumberFormat(
    'en-US',
    { style: 'currency', currency: 'USD'}
  ).format(number)
}

export const unformatCurrency = (currencyFormat:string)  => {
  return currencyFormat.replace(/[^0-9.-]+/g,'')
}

export class RootNavigation {
  public static navigationRef = React.createRef<any>()
  public static navigate = (name, params?) => {
    RootNavigation.navigationRef.current?.navigate(name, params)
  }
  public static goBack = () => {
    RootNavigation.navigationRef.current?.goBack()
  }
  public static reset = (view) => {
    RootNavigation.navigationRef.current?.reset({
      index: 0,
      routes: [{name: view}],
    })
  }
}
