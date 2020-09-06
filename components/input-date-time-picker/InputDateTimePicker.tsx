import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from "react-native";
import { Button } from 'react-native-elements';
import DateTimePickerModal, { ReactNativeModalDateTimePickerProps } from "react-native-modal-datetime-picker";
import { FormikProps } from 'formik';
import { COLORS } from '../../constants';

interface InputDateTimePicker extends Omit<ReactNativeModalDateTimePickerProps, 'onCancel'|'onConfirm'> {
  label: string,
  value?: Date,
  errorMessage?: string,
  width: number | string,
  name?: string,
  formik?: FormikProps<any>,
  onPick?(Date): void,
}

const InputDateTimePicker = (props: InputDateTimePicker) => {

  const mode: any = (props.mode) ? props.mode : 'date';
  const width = (props.width)? props.width : (mode === 'date')? 160 : 150;

  const [error, showError]:any = useState(false);
  useEffect(() => {
    if (props.formik && props.name) {
      showError((props.formik.touched[props.name] && props.formik.errors[props.name])
        ?props.formik.errors[props.name]
        : ''
      );
    }
  });

  const styles = StyleSheet.create({
    container: {
      minWidth: width,
      paddingHorizontal: 10,
    },
    label: {
      color: (error)? COLORS.error : COLORS.primary,
      fontWeight: 'bold',
      fontSize: 16,
    },
    button: {
      justifyContent: 'space-between',
      borderWidth: 2,
      borderRadius: 5,
      height: 45,
      borderColor: (error)? COLORS.error : COLORS.primary,
    },
    buttonTitleStyle: {
      color: (error)? COLORS.error : null,
      fontWeight: 'normal',
    },
    errorMessage: {
      color: COLORS.error,
      minHeight: 20,
      fontSize: 12,
      paddingLeft: 5,
      paddingVertical: 5,
    }
  });

  const [visible, isVisible] = useState(false);

  let formatValue = '--';
  let initialValue:any = null;

  if (props.value) {
    initialValue = props.value;
  } else if (props.name && props.formik && props.formik.values.hasOwnProperty(props.name)) {
    initialValue = props.formik.values[props.name];
  }

  if (initialValue && initialValue instanceof Date) {
    formatValue = formatDateTime(initialValue);
  } else {
    initialValue = new Date();
  }

  const [value, setValue] = useState(initialValue);
  const [format, setFormat] = useState(formatValue);

  const handleConfirm = (dt:Date) => {
    dt.setMilliseconds(0);
    dt.setSeconds(0);
    setValue(dt);
    setFormat(formatDateTime(dt, mode));
    isVisible(false);
    if (props.onPick && typeof(props.onPick) === 'function') {
      props.onPick(dt);
    }
    if(props.formik && props.name){
      props.formik.setFieldValue(props.name, dt);
    }
  }

  const handleCancel = () => {
    isVisible(false);
    if(props.formik && props.name){
      props.formik.setFieldTouched(props.name, true);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {props.label}
      </Text>
      <Button
        iconRight={true}
        icon={{
          name: (mode === 'date')? 'calendar-alt' : 'clock',
          type:'font-awesome-5',
          color:(error)? COLORS.error : COLORS.primary,
        }}
        title={format}
        type='outline'
        buttonStyle={styles.button}
        titleStyle={styles.buttonTitleStyle}
        onPress={() => {isVisible(true)}}
      />
      <DateTimePickerModal
        isVisible={visible}
        mode={mode}
        date={value}
        headerTextIOS={props.label}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        {...props}
      />
      <Text style={styles.errorMessage}>
        {props.errorMessage || error}
      </Text>
    </View>
  )
}

// get date format as ##-##-#### and time format as ##:## AM | PM
const formatDateTime = (dt:Date, mode = 'date') => {

  let dtf: string;

  if (!dt) {
    return '--';
  }

  if (mode === 'date') {
    let dtfArr = dt.toLocaleDateString().split('/');
    for (let i = 0; i < dtfArr.length; i++) {
      dtfArr[i] = (dtfArr[i].length === 1) ? '0' + dtfArr[i] : dtfArr[i];
    }
    dtf = dtfArr.join('-');
  } else {
    dtf = dt.toLocaleTimeString().replace(/:0{2}(\sAM|\sPM)$/g, '');
    dtf += (dt.getHours() >= 12)? ' PM': ' AM';
  }

  return dtf;
};

export default InputDateTimePicker;