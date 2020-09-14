import React, { useState } from 'react';
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { Icon } from 'react-native-elements';
import { COLORS } from '../../constants';

interface TabAddButtonProps {
  onPress?(event: GestureResponderEvent): void;
}

const TabAddButton = (props: TabAddButtonProps) => {

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 40,
    },
    icon: {
      borderWidth: 3,
      borderColor: COLORS.primary,
    }
  });

  return (
    <View style={styles.container}>
      <Icon
        reverse
        name='plus'
        type='font-awesome-5'
        color={COLORS.primary}
        onPress={props.onPress}
      />
    </View>
  )
}

export default TabAddButton