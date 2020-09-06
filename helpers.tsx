import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

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