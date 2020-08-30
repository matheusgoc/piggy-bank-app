import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from "react-native";
import { Button, ThemeContext } from 'react-native-elements';
import DateTimePickerModal, { ReactNativeModalDateTimePickerProps } from "react-native-modal-datetime-picker";

interface InputDateTimePicker extends Omit<ReactNativeModalDateTimePickerProps, 'onCancel'|'onConfirm'> {
  label: string,
  value?: Date,
  errorMessage?: string,
  width: number | string,
  onPick?(Date): void,
}

const InputDateTimePicker = (props: InputDateTimePicker) => {

  const {theme} = useContext(ThemeContext);
  const mode: any = (props.mode) ? props.mode : 'date';
  const width = (props.width)? props.width : (mode === 'date')? 160 : 150;

  const styles = StyleSheet.create({
    container: {
      minWidth: width,
      paddingHorizontal: 10,
    },
    label: {
      color: theme.colors.primary,
      fontWeight: 'bold',
      fontSize: 16,
    },
    button: {
      justifyContent: 'space-between',
      borderWidth: 2,
      borderRadius: 5,
      height: 45,
    },
    buttonTitleStyle: {
      color: null,
      fontWeight: 'normal',
    },
    errorMessage: {
      color: theme.colors.error,
      minHeight: 20,
      fontSize: 12,
      paddingLeft: 5,
      paddingVertical: 5,
    }
  });

  const [visible, isVisible] = useState(false);

  let initialValue = new Date();
  let formatValue = '--';
  if (props.value && props.value instanceof Date) {
    initialValue = props.value;
    formatValue = formatDateTime(initialValue);
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
      props.onPick(dt.toLocaleString());
    }
  }

  const handleCancel = () => {
    isVisible(false);
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
          color:theme.colors.primary
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
        {props.errorMessage}
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