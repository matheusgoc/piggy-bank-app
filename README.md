# Piggy Bank App

_Current Version 1.1.0_

Piggy Bank App is part of a final project called Personal Expenses Tracking App (PETA) 
from Illinois State University (ISU). It is a mobile App designed to make people gain 
control over their own expenses.

## PETA Project

The purpose of this project is to build a mobile App to serve as 
an easy and enjoyable tool to help people have more control over their outgoings 
and savings by allowing them to handle transactions over time and review their 
spending through some reports, graphs, and statistical insights. 

## Stack

This App adopts the following open-source libraries and frameworks:

| Libraries and Frameworks                                                  | Versions    |
| ------------------------------------------------------------------------- | ----------- |
| [Expo](https://expo.io)                                                   | ^40.0.0     |
| [React Native Framework](https://reactnative.dev)                         | sdk-40.0.1  |
| [React JavaScript Library](https://reactjs.org)                           | ^16.13.1    |
| [TypeScript](https://www.typescriptlang.org)                              | ~4.0.0      |
| [React Redux](https://react-redux.js.org)                                 | ^7.2.1      |
| [Redux Persist](https://github.com/rt2zz/redux-persist)                   | ^6.0.0      |
| [Axios](https://github.com/axios/axios)                                   | ^0.20.0     |
| [React Native Elements](https://reactnativeelements.com)                  | ^2.3.2      |
| [Formik](https://formik.org)                                              | ^2.1.5      |
| [Victory Native](https://formidable.com/open-source/victory/docs/native)  | ^35.0.1     |

## Run

After cloning the code, install the `node` dependencies:

### `npm install`

Rename the file .env-example to .env and change the following attributes 

- STORAGE_URL
- API_URL

or set them on `constants.ts` file.

Then, **run** the app in the development mode:

### `npm start`

The Expo server will be available in your browser at 
[http://localhost:19002](http://localhost:19002)

Scan the QRCode and open the App through Expo Go Client.

## Debug

To run on debug mode, install 
[React Native Debugger](https://github.com/jhen0409/react-native-debugger),
and run following command:

### `npm run debug`