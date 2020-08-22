import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Onboard from "./features/onboard/Onboard";
import { ThemeProvider } from "react-native-elements";

export default function App() {

  return (
      <ThemeProvider theme={theme}>
        <Onboard />
      </ThemeProvider>

      // <View style={styles.container}>
      //   <Text>MY Piggy Bank</Text>
      // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006600',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const theme = {
    colors: {
        primary: '#006600',
        secondary: '#ffffff',
    }
};