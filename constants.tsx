import IMask from 'imask';
import { Theme } from 'react-native-elements';
import DropdownAlert from 'react-native-dropdownalert';
// @ts-ignore
import { BASE_PATH_API, BASE_PATH_STORAGE } from '@env';
// export const STORAGE_URL = BASE_PATH_STORAGE;
// export const API_URL = BASE_PATH_API;
export const STORAGE_URL = 'http://192.168.1.143:81/storage/';
export const API_URL = 'http://192.168.1.143:81/api/';
export const PLAID_VIEW_URL = 'https://cdn.plaid.com/link/v2/stable/link.html?isWebview=true&token=';

export const COLORS = {
  primary: '#006600',
  secondary: '#ffffff',
  ternary: '#0000ff',
  success: '#008600',
  error: '#860000',
  danger: '#dd0000',
  warning: '#c85200',
  gray: '#888888',
  mediumGray: '#cccccc',
  lightGray: '#eeeeee',
  black: '#000000',
}

export const PALLET = [
  '#d4cc56','#0b0c10','#fff8dd','#f49ade','#9c7ab5',
  '#a4c639','#0c1a4b','#ffe4d1','#ff0000','#7b5c99',
  '#a5e519','#143d8c','#fdcbcb','#ff4f00','#664b8a',
  '#559938','#84b2ca','#f9b2d2','#ff6900','#523c79',
  '#1b8a24','#abc4d0','#ff9000','#ffa900','#443166',
]

export const LOADING = {
  overlayColor: 'rgba(0,0,0,0.5)',
  textStyle: { color: '#FFF' },
  animation: 'fade',
}

export const THEME:Theme = {
  SearchBar: {
    inputContainerStyle: {
      borderWidth: 0,
    }
  },
  colors: {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    success: COLORS.success,
    error: COLORS.error,
    warning: COLORS.warning,
  },
  Button: {
    buttonStyle: {
      borderRadius: 0,
      margin: 0,
      height: 55,
    },
    titleStyle: {
      fontWeight: 'bold'
    }
  },
  Input: {
    inputContainerStyle: {
      borderColor: COLORS.primary,
      borderWidth: 2,
      borderBottomColor: COLORS.primary,
      borderBottomWidth: 2,
      borderRadius: 5,
      paddingLeft: 10,
    },
    labelStyle: {
      color: COLORS.primary,
    },
    errorStyle: {
      color: COLORS.error,
      fontSize: 12,
    }
  }
};

export const US_STATES = {
  'AL': 'Alabama',
  'AK': 'Alaska',
  'AS': 'American Samoa',
  'AZ': 'Arizona',
  'AR': 'Arkansas',
  'CA': 'California',
  'CO': 'Colorado',
  'CT': 'Connecticut',
  'DE': 'Delaware',
  'DC': 'District Of Columbia',
  'FM': 'Federated States Of Micronesia',
  'FL': 'Florida',
  'GA': 'Georgia',
  'GU': 'Guam',
  'HI': 'Hawaii',
  'ID': 'Idaho',
  'IL': 'Illinois',
  'IN': 'Indiana',
  'IA': 'Iowa',
  'KS': 'Kansas',
  'KY': 'Kentucky',
  'LA': 'Louisiana',
  'ME': 'Maine',
  'MH': 'Marshall Islands',
  'MD': 'Maryland',
  'MA': 'Massachusetts',
  'MI': 'Michigan',
  'MN': 'Minnesota',
  'MS': 'Mississippi',
  'MO': 'Missouri',
  'MT': 'Montana',
  'NE': 'Nebraska',
  'NV': 'Nevada',
  'NH': 'New Hampshire',
  'NJ': 'New Jersey',
  'NM': 'New Mexico',
  'NY': 'New York',
  'NC': 'North Carolina',
  'ND': 'North Dakota',
  'MP': 'Northern Mariana Islands',
  'OH': 'Ohio',
  'OK': 'Oklahoma',
  'OR': 'Oregon',
  'PW': 'Palau',
  'PA': 'Pennsylvania',
  'PR': 'Puerto Rico',
  'RI': 'Rhode Island',
  'SC': 'South Carolina',
  'SD': 'South Dakota',
  'TN': 'Tennessee',
  'TX': 'Texas',
  'UT': 'Utah',
  'VT': 'Vermont',
  'VI': 'Virgin Islands',
  'VA': 'Virginia',
  'WA': 'Washington',
  'WV': 'West Virginia',
  'WI': 'Wisconsin',
  'WY': 'Wyoming'
};

export const MASKS = {
  //^([0-9]{5})([\-]{1}[0-9]{4})?$
  zipcode: IMask.createMask({
    mask: '0000[0]-0000'
  }),
  currency: IMask.createMask({
    mask: '$numsep00',
    blocks: {
      num: {
        mask: /^\d+$/
      },
      sep: {
        mask: /^[.,]?$/
      },
    },
  }),
  digit: IMask.createMask({
    mask: /^\d+$/
  })
};

export const TOAST: { ref: DropdownAlert } = {
  ref: null,
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
}

export enum ACTIONS {
  CREATE_PROFILE,
  RESET_PASSWORD,
  RESET_PASSWORD_LOGGED,
  CHANGE_PASSWORD,
}