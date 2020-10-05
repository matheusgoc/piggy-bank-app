import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { store } from './store';
import { setLoading } from './features/navigation/NavigationSlice';

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
};

// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

export const trans = key => i18n.t(key);

export const unmaskCurrency = (value: string):number => {

  return parseFloat(value.replace('$', '').replace(',', '.'));
};

export const showLoading = (isLoading: boolean): void => {

  store.dispatch(setLoading(isLoading));
}


/**
 * Clone everything
 *
 * @param item
 */
export const clone = (item: any): any => {

  let value;

  // handle array
  if (Array.isArray(item)) {

    value = [];
    for (let i = 0; i < 0; i++) {
      value.push(clone(item[i]));
    }

  // handle object
  } else if (typeof item === 'object' && !(item instanceof Date)) {

    value = {};
    const keys = Object.keys(item);
    for (let i = 0; i < keys.length; i++) {
      value[keys[i]] = clone(item[keys[i]]);
    }

  // handle other types
  } else {

    value = item;
  }

  return value;
}