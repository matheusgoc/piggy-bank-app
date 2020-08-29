import React, { useContext } from 'react';
import { StyleSheet, Text, View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { ThemeContext } from 'react-native-elements';

interface DropDown extends DropDownPicker {
  label: any,
  value?: any,
  onChange?(item:any): void,
}

const DropDown = (props: DropDown) => {

  const {theme} = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      width: '95%',
      height: 45,
      alignSelf: 'center',
      marginBottom: 35,
      zIndex: 10,
    },
    label: {
      color: theme.colors.primary,
      fontWeight: 'bold',
      fontSize: 16,
    },
    picker: {
      backgroundColor: 'transparent',
      padding: 0,
    },
    pickerContainer: {
      width: '100%',
      height: '100%',
      borderColor: theme.colors.primary,
      borderRadius: 5,
      borderWidth: 2,
      backgroundColor: '#ffffff',
    },
    pickerItem: {
      margin: 0,
      justifyContent: 'flex-start',
      fontSize: 16,
      color: theme.colors.primary,
    },
    pickerDropDown: {
      backgroundColor: "#ffffff",
      alignSelf: 'flex-start',
      borderRadius: 5,
      borderColor: theme.colors.primary,
      borderWidth: 1,
    },
    pickerLabel: {
      color: theme.colors.primary,
      fontSize: 16,
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {props.label}
      </Text>
      <DropDownPicker
        items={props.items}
        defaultValue={props.value}
        style={styles.picker}
        containerStyle={styles.pickerContainer}
        itemStyle={styles.pickerItem}
        labelStyle={styles.pickerLabel}
        dropDownStyle={styles.pickerDropDown}
        onChangeItem={(item) => props.onChange(item)}
        {...props}
      />
    </View>
  )
}

export default DropDown;