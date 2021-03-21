import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { COLORS } from '../../constants';

const BankingEmptyState = (props: {message: string}) => (
  <View style={styles.container}>
    <Icon
      name='exclamation-triangle'
      type='font-awesome'
      size={50}
      color={COLORS.gray}
    />
    <Text style={styles.message}>
      {props.message}
    </Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingBottom: 100,
  },
  message: {
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: 'bold',
    paddingTop: 10,
  },
})

export default BankingEmptyState