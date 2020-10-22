import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { FormikProps } from 'formik';
import { COLORS } from '../../constants';
import { BottomSheet, BottomSheetProps, Button, ListItem } from 'react-native-elements';

interface DropDown {
  items: Array<{label: string, value: string|number}>,
  label: any,
  value?: any,
  width?: string | number,
  errorMessage?: string,
  name?: string,
  formik?: FormikProps<any>,
  placeholder?: string,
  onChange?(item:any): void,
}

const DropDown = (props: DropDown) => {

  const [value, setValue] = useState(props.value || props.formik?.values[props.name]);
  const [visible, setVisible] = useState(false);
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
    ...baseStyles,
    container: {
      ...baseStyles.container,
      width: props.width || '100%',
    },
    label: {
      ...baseStyles.label,
      color: (error)? COLORS.error : COLORS.primary,
    }
  });

  const handleOnOpen = () => {
    setVisible(true);
  };

  const handleOnPress = (item) => {
    setVisible(false);
    setValue(item);
    if (props.formik?.values[props.name]) {
      props.formik.values[props.name] = item.value;
      props.formik.validateForm();
    }
    if (props.onChange) {
      props.onChange(item);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {props.label}
      </Text>
      <Button
        title={ value.label || props.placeholder || '--' }
        type="outline"
        onPress={handleOnOpen}
        iconRight={true}
        icon={{
          name: (visible)? 'caret-up' : 'caret-down',
          type: 'font-awesome',
          color:(error)? COLORS.error : COLORS.primary,
        }}
        buttonStyle={styles.button}
        titleStyle={styles.buttonTitle}
      />
      <BottomSheet isVisible={visible} modalProps={{}}>
        {props.items.map((item, index) => (
          <ListItem key={index} onPress={() => handleOnPress(item)}>
            <ListItem.Content>
              <ListItem.Title>{item.label}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
      <Text style={styles.errorMessage}>
        {props.errorMessage || error}
      </Text>
    </View>
  )
}

const baseStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    zIndex: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 5,
    height: 45,
    marginHorizontal: 10,
  },
  buttonTitle: {
    fontWeight: 'normal',
    width: '80%',
    textAlign: 'left',
  },
  errorMessage: {
    color: COLORS.error,
    minHeight: 20,
    fontSize: 12,
    paddingLeft: 5,
    paddingVertical: 5,
  },
});

export default DropDown;