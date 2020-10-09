import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from "react-native";
import { Button } from 'react-native-elements';
import moment from 'moment';
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

  const [visible, isVisible] = useState(false);
  const [error, showError]:any = useState(false);
  useEffect(() => {
    if (props.formik && props.name) {
      showError((props.formik.touched[props.name] && props.formik.errors[props.name])
        ? props.formik.errors[props.name]
        : ''
      );
    }
  });

  const styles = StyleSheet.create({
    ...baseStyles,
    container: {
      ...baseStyles.container,
      minWidth: width,
    },
    label: {
      ...baseStyles.label,
      color: (error)? COLORS.error : COLORS.primary,
    },
    button: {
      ...baseStyles.button,
      borderColor: (error)? COLORS.error : COLORS.primary,
    },
    buttonTitle: {
      ...baseStyles.buttonTitle,
      color: (error)? COLORS.error : null,
    },
  });

  let formatValue = '--';
  let initialValue:Date = props.formik?.values[props.name] || props.value || null;
  if (initialValue && initialValue instanceof Date) {
    formatValue = formatDateTime(initialValue, mode);
  }

  const [value, setValue] = useState(initialValue);
  const [format, setFormat] = useState(formatValue);

  const handleConfirm = (dt:Date) => {
    dt.setMilliseconds(0);
    dt.setSeconds(0);
    setValue(dt);
    setFormat(formatDateTime(dt, mode));
    isVisible(false);
    if (props.onPick) {
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

  const handleButtonPress = () => {
    setValue(new Date());
    isVisible(true);
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
        titleStyle={styles.buttonTitle}
        onPress={handleButtonPress}
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
const formatDateTime = (dt?:Date, mode = 'date') => {

  let format = '--';
  if (dt) {
    switch (mode) {
      case 'date': format = moment(dt).format('L'); break;
      case 'time': format =  moment(dt).format('LT'); break;
    }
  }

  return format;
};

const baseStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 3,
  },
  button: {
    justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 5,
    height: 45,
  },
  buttonTitle: {
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

export default InputDateTimePicker;