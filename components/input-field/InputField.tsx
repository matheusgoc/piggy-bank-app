import React, { useEffect, useState } from 'react';
import { FormikProps } from 'formik';
import { Input, InputProps } from 'react-native-elements';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { COLORS, MASKS } from '../../constants';

export interface InputField extends InputProps {
  name?: string,
  formik?: FormikProps<any>,
  width?: string | number,
  mask?: string,
  onChangeText?(value: string): void,
  onBlur?(e: NativeSyntheticEvent<TextInputFocusEventData>): void,
}

const InputField = (props: InputField) => {

  const [error, showError]:any = useState('');
  useEffect(() => {
    if (props.formik && props.name) {

      showError((props.formik.touched[props.name] && props.formik.errors[props.name])
        ? props.formik.errors[props.name]
        : ''
      );
    }
  });

  const styles = {
    container: {
      color: (error)? COLORS.error : null,
      width: props.width || '100%',
    },
    inputContainer: {
      color: (error)? COLORS.error : null,
      borderColor: (error)? COLORS.error : COLORS.primary,
      borderBottomColor: (error)? COLORS.error : COLORS.primary,
    },
    label: {
      color: (error)? COLORS.error : COLORS.primary,
    },
  };

  return (
    <Input
      onChangeText={(value) => {
        if (props.formik && props.name) {
          props.formik.setFieldValue(props.name, (props.mask)? MASKS[props.mask].resolve(value) : value);
        }
      }}
      onBlur={(e) => {
        if (props.formik && props.name) {
          props.formik.setFieldTouched(props.name, true);
        }
      }}
      errorMessage={props.errorMessage || error}
      containerStyle={styles.container}
      inputContainerStyle={styles.inputContainer}
      labelStyle={styles.label}
      value={props.formik.values[props.name]}
      {...props}
    />
  )
}

export default InputField;