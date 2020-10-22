import InputField, { InputFieldProps } from '../input-field/InputField';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { formatCurrency } from '../../helpers';

interface CurrencyField extends InputFieldProps {}

const CurrencyField = (props: CurrencyField) => {

  let initialValue = props.value || props.formik?.values[props.name] || '0.00';
  const [value, setValue] = useState(formatCurrency(initialValue));
  // const [selection, setSelection] = useState(null);

  const handleOnChangeText = (inputValue) => {

    // format value
    inputValue = inputValue.replace(/\D/g, '').padEnd(3 - inputValue.length, '0');
    const whole = inputValue.slice(0, inputValue.length - 2);
    const fraction = inputValue.slice(inputValue.length - 2, inputValue.length);
    inputValue = whole + '.' + fraction;
    setValue(formatCurrency(inputValue));

    // assign value
    if (props.value) {
      props.value = inputValue;
    } else if (props.name && props.formik) {
      props.formik.values[props.name] = Number(inputValue);
      props.formik.validateForm();
    }
    if (props.onChangeText) {
      props.onChangeText(inputValue.toString());
    }
  }

  // const handleOnFocus = (e) => {
  //   setSelection({start: value.length});
  //   setSelection(null);
  //   if (props.onFocus) {
  //     props.onFocus(e);
  //   }
  // }
  //
  // const handleOnKeyPress = (e) => {
  //   setSelection(null);
  //   if (props.onKeyPress) {
  //     props.onKeyPress(e);
  //   }
  // }

  return (
    <InputField
      placeholder='$0.00'
      keyboardType='number-pad'
      inputStyle={styles.currencyInput}
      // selection={selection}
      {...props}
      value={value}
      onChangeText={handleOnChangeText}
      // onKeyPress={handleOnKeyPress}
      // onFocus={handleOnFocus}
    />
  )
}

const styles = StyleSheet.create({
  currencyInput: {
    // textAlign: 'right',
    paddingRight: 10
  },
});

export default CurrencyField;