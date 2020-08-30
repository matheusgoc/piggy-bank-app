import React, { useContext } from 'react';
import { StyleSheet, Text, View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { ThemeContext } from 'react-native-elements';

interface DropDown extends DropDownPicker {
  label: any,
  value?: any,
  width?: string | number,
  errorMessage?: string,
  onChange?(item:any): void,

}

const DropDown = (props: DropDown) => {

  const {theme} = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      width: props.width || '100%',
      paddingHorizontal: 10,
    },
    label: {
      color: theme.colors.primary,
      fontWeight: 'bold',
      fontSize: 16,
    },
    picker: {
      backgroundColor: 'transparent',
      padding: 0,
      borderWidth: 0,
      zIndex: 10,
    },
    pickerContainer: {
      backgroundColor: '#ffffff',
      width: '100%',
      height: 45,
      borderColor: theme.colors.primary,
      borderRadius: 5,
      borderWidth: 2,
    },
    pickerItem: {
      justifyContent: 'flex-start',
    },
    pickerDropDown: {
      backgroundColor: "#ffffff",
      alignSelf: 'flex-start',
      borderRadius: 5,
      borderColor: theme.colors.primary,
      borderWidth: 1,
      zIndex: 10,
    },
    pickerLabel: {
      fontSize: 16,
    },
    errorMessage: {
      color: theme.colors.error,
      minHeight: 20,
      fontSize: 12,
      paddingLeft: 5,
      paddingVertical: 5,
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
        placeholder='--'
        style={styles.picker}
        containerStyle={styles.pickerContainer}
        itemStyle={styles.pickerItem}
        labelStyle={styles.pickerLabel}
        dropDownStyle={styles.pickerDropDown}
        onChangeItem={(item) => props.onChange(item)}
        {...props}
      />
      <Text style={styles.errorMessage}>
        {props.errorMessage}
      </Text>
    </View>
  )
}

export default DropDown;