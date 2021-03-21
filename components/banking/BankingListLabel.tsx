import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants';
import { Divider } from 'react-native-elements';

interface BankingListLabelProps {
  label: string,
  height?: string | number,
}

const BankingListLabel = (props: BankingListLabelProps) => {

  const styles = StyleSheet.create({
    ...baseStyles,
    container: {
      ...baseStyles.container,
      height: props.height ?? '10%',
    },
  });

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>
          {props.label}
        </Text>
      </View>
      <Divider />
    </>
  )
}

const baseStyles = StyleSheet.create({
  container: {
    height: '10%',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: COLORS.secondary,
  },
  label: {
    fontSize: 20,
    color: COLORS.primary,
  },
})

export default BankingListLabel