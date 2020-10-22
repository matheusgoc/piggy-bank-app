import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormikProps } from 'formik';
import { Button, Divider } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import InputField from '../../components/input-field/InputField';
import { ProfilePasswordModel } from '../../models/ProfilePasswordModel';
import { COLORS } from '../../constants';
import TextIcon from '../../components/text-icon/TextIcon';

const PasswordForm = (props: FormikProps<ProfilePasswordModel>) => {

  const {
    handleSubmit,
    values,
    isValid,
    setValues,
    errors,
    touched,
  } = props;

  const [length, hasLength] = useState(false);
  const [specialChar, hasSpecialChar] = useState(false);
  const [capitalLetter, hasCapitalLetter] = useState(false);
  const [number, hasNumber] = useState(false);

  const validateStrength = (password) => {

    // remove spaces
    password = password.replace(/\s+/, '');

    // check password constraints
    const test = {
      length: /.{6,}/.test(password),
      specialChar: /\W|_/.test(password),
      capitalLetter: /[A-Z]/.test(password),
      number: /\d/.test(password),
    };
    hasLength(test.length);
    hasSpecialChar(test.specialChar);
    hasCapitalLetter(test.capitalLetter);
    hasNumber(test.number);

    // calculate strength
    let strength = 0;
    strength += (test.length)? .25 : 0;
    strength += (test.specialChar)? .25 : 0;
    strength += (test.capitalLetter)? .25 : 0;
    strength += (test.number)? .25 : 0;

    // set strength and password
    setValues({
      password,
      strength,
      confirmation: values.confirmation,
    });
  };

  return (
    <SafeAreaView style={styles.style}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}>
        <View>
          <View style={styles.form}>
            <InputField
              name='password'
              formik={props}
              label='Password'
              autoCapitalize='none'
              textContentType='oneTimeCode'
              keyboardType='ascii-capable'
              secureTextEntry={true}
              onChangeText={password => {
                validateStrength(password)
              }}
              leftIcon={{
                name: 'lock-outline',
                type: 'material-community',
                color: (errors.password && touched.password)? COLORS.error : COLORS.primary,
              }}
            />
            <InputField
              name='confirmation'
              formik={props}
              label='Confirm your password'
              autoCapitalize='none'
              textContentType='oneTimeCode'
              keyboardType='ascii-capable'
              secureTextEntry={true}
              leftIcon={{
                name: 'lock-outline',
                type: 'material-community',
                color: (errors.confirmation && touched.confirmation)? COLORS.error : COLORS.primary,
              }}
            />
          </View>
          <Divider style={{ backgroundColor: COLORS.primary }} />
          <View style={styles.strength}>
            <Text style={styles.strengthTitle}>Password Strength</Text>
            <Progress.Bar
              color={
                (values.strength < 0.50)
                  ? COLORS.error
                  : (values.strength < 0.75)
                  ? COLORS.warning
                  : COLORS.primary
              }
              progress={values.strength}
              width={250}
              height={10}
            />
            <View>
              <TextConstraint flag={length}>6+ characters</TextConstraint>
              <TextConstraint flag={specialChar}>Special Characters</TextConstraint>
              <TextConstraint flag={capitalLetter}>Capital Letter</TextConstraint>
              <TextConstraint flag={number}>Number</TextConstraint>
            </View>
          </View>
        </View>
        <View style={styles.save}>
          <Button
            title='Create my profile'
            disabled={!isValid}
            onPressOut={() => {
              handleSubmit();
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const TextConstraint = (props: {flag: boolean, children?: any}) => {
  return (
    <TextIcon
      textStyle={(props.flag)? styles.strengthStrong : styles.strengthWeek}
      color={(props.flag)? COLORS.primary : COLORS.error}
      name={(props.flag)? 'check' : 'times'}
      type='font-awesome-5'>
      {props.children}
    </TextIcon>
  )
}

const styles = StyleSheet.create({
  style: {
    backgroundColor: 'white',
  },
  container: {
    height: '100%',
    justifyContent: 'space-between',
    width: '100%',
  },
  form: {
    paddingHorizontal: '15%',
    paddingVertical: '3%',
  },
  strength: {
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: 160,
  },
  strengthTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  strengthWeek: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: 'bold',
  },
  strengthStrong: {
    color: COLORS.success,
    fontWeight: 'bold',
    fontSize: 16,
  },
  save: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});

export default PasswordForm;