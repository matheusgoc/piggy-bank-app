import InputField, { InputFieldProps } from '../input-field/InputField';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { MASKS } from '../../constants';
import { unmaskCurrency } from '../../helpers';

interface CurrencyField extends InputFieldProps {}

const CurrencyField = (props: CurrencyField) => {

  let initialValue = '';

  if (props.value) {
    initialValue = props.value;
  } else if (props.name && props.formik && props.formik.values[props.name]) {
    initialValue = props.formik.values[props.name];
  }

  const [value, setValue] = useState(MASKS.currency.resolve(initialValue.toString()));

  return (
    <InputField
      onChangeText={(value) => {
        if (props.value) {
          props.value = unmaskCurrency(value).toString();
        } else if (props.name && props.formik) {
          props.formik.values[props.name] = unmaskCurrency(value);
        }
        setValue(MASKS.currency.resolve(value));
      }}
      placeholder='$0.00'
      keyboardType='decimal-pad'
      inputStyle={styles.currencyInput}
      {...props}
      value={value}
    />
  )
}

const styles = StyleSheet.create({
  currencyInput: {
    textAlign: 'right',
    paddingRight: 10
  },
});

export default CurrencyField;