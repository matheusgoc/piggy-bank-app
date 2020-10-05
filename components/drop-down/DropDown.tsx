import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { FormikProps } from 'formik';
import { COLORS } from '../../constants';

interface DropDown extends DropDownPicker {
  label: any,
  value?: any,
  width?: string | number,
  errorMessage?: string,
  name?: string,
  formik?: FormikProps<any>,
  onChange?(item:any): void,
}

const DropDown = (props: DropDown) => {

  const [error, showError]:any = useState('');
  useEffect(() => {
    if (props.formik && props.name) {
      showError((props.formik.touched[props.name] && props.formik.errors[props.name])
        ? props.formik.errors[props.name]
        : ''
      );
    }
  });

  const styles = StyleSheet.create({
    container: {
      width: props.width || '100%',
      paddingHorizontal: 10,
      zIndex: 10,
    },
    label: {
      color: (error)? COLORS.error : COLORS.primary,
      fontWeight: 'bold',
      fontSize: 16,
    },
    picker: {
      backgroundColor: 'transparent',
      padding: 0,
      borderWidth: 0,
    },
    pickerContainer: {
      backgroundColor: '#ffffff',
      width: '100%',
      height: 45,
      borderColor: (error)? COLORS.error : COLORS.primary,
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
      borderColor: (error)? COLORS.error : COLORS.primary,
      borderWidth: 1,
    },
    pickerLabel: {
      fontSize: 16,
    },
    errorMessage: {
      color: COLORS.error,
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
        defaultValue={(props.value)? props.value : props.formik.values[props.name]}
        placeholder='--'
        style={styles.picker}
        containerStyle={styles.pickerContainer}
        itemStyle={styles.pickerItem}
        labelStyle={styles.pickerLabel}
        dropDownStyle={styles.pickerDropDown}
        arrowColor={(error)? COLORS.error : null}
        searchablePlaceholder='Search'
        onChangeItem={(item) => {
          if(props.formik && props.name){
            props.formik.setFieldValue(props.name, item.value);
          }
        }}
        onClose={() => {
          if(props.formik && props.name){
            setTimeout(() => {
              props.formik.setFieldTouched(props.name, true);
            }, 5);
          }
        }}
        {...props}
      />
      <Text style={styles.errorMessage}>
        {props.errorMessage || error}
      </Text>
    </View>
  )
}

export default DropDown;