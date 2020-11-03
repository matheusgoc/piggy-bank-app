import React from 'react';
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormikProps } from 'formik';
import { Button } from 'react-native-elements';
import { COLORS } from '../../constants';
import InputField from '../../components/input-field/InputField';

const ResetPasswordForm = (props: FormikProps<{email: string}>) => {

  const {
    handleSubmit,
    isValid,
    touched,
    errors,
  } = props;

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}>
        <Text style={styles.legend}>Please, enter your email to generate a new password:</Text>
        <InputField
          name='email'
          formik={props}
          label='Email'
          placeholder='Enter your email'
          textContentType='emailAddress'
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          leftIcon={{
            name: 'email-outline',
            type: 'material-community',
            color: (touched.email && errors.email)? COLORS.error : COLORS.primary,
          }}
        />
        <Button
          title='Next'
          disabled={!isValid}
          onPressOut={() => {
            handleSubmit();
          }}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
  },
  container: {
    padding: 20,
    height: '100%',
    justifyContent: 'space-between',
  },
  legend: {
    fontSize: 20,
    paddingHorizontal: 10,
  }
});

export default ResetPasswordForm;