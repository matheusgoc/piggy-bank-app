import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormikProps } from 'formik';
import { Button, Divider } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../../components/input-field/InputField';
import { ProfilePasswordModel } from '../../models/ProfilePasswordModel';
import { ACTIONS, COLORS } from '../../constants';
import TextIcon from '../../components/text-icon/TextIcon';
import { PasswordProps } from './Password';
import { setAction, getAction } from '../navigation/NavigationSlice';
import { getProfile } from './ProfileSlice';
import ProfileServiceApi from '../../services/ProfileServiceApi';
import { showLoading } from '../../helpers';

const PasswordForm = (props: PasswordProps & FormikProps<ProfilePasswordModel>) => {

  const {
    handleSubmit,
    values,
    isValid,
    setValues,
    errors,
    touched,
  } = props;

  const dispatch = useDispatch();
  const profile = useSelector(getProfile);
  const action = useSelector(getAction);

  const [length, hasLength] = useState(false);
  const [specialChar, hasSpecialChar] = useState(false);
  const [capitalLetter, hasCapitalLetter] = useState(false);
  const [number, hasNumber] = useState(false);

  const navigation = useNavigation();

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
      current: values.current,
    });
  };

  const handleResetPassword = () => {

    const profileServiceApi = new ProfileServiceApi();
    showLoading(true);
    profileServiceApi.requestPIN(profile.email).then(function () {

      dispatch(setAction(ACTIONS.RESET_PASSWORD_LOGGED));
      navigation.navigate('ResetPasswordPIN', { email: profile.email });

    }).catch((error) => {
      console.warn('PasswordForm.handleResetPassword: ' + error);
    }).finally(() => {
      showLoading(false);
    });
  }

  return (
    <SafeAreaView style={styles.style}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}>
        <View>
          <View style={styles.form}>
            {(action == ACTIONS.CHANGE_PASSWORD)? (
              <InputField
                name='current'
                formik={props}
                label='Current Password'
                autoCapitalize='none'
                textContentType='oneTimeCode'
                keyboardType='ascii-capable'
                secureTextEntry={true}
                leftIcon={{
                  name: 'lock-outline',
                  type: 'material-community',
                  color: (errors.current && touched.current)? COLORS.error : COLORS.primary,
                }}
              />
            ) : null}
            <InputField
              name='password'
              formik={props}
              label={(action == ACTIONS.CREATE_PROFILE)? 'Password' : 'New Password'}
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
              label={(action == ACTIONS.CREATE_PROFILE)? 'Confirm your password' : 'Confirm your new password'}
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
          {(action == ACTIONS.CHANGE_PASSWORD)? (
            <Button
              type='clear'
              title='Forgotten password?'
              containerStyle={styles.linkForgotten}
              titleStyle={styles.linkForgottenTitle}
              onPressOut={handleResetPassword}
            />
          ) : null}
          <Button
            title={(action == ACTIONS.CREATE_PROFILE)? 'Create my profile' : 'Change my password'}
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
  linkForgotten: {
    alignSelf: 'flex-end',
  },
  linkForgottenTitle: {
    color: COLORS.ternary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PasswordForm;