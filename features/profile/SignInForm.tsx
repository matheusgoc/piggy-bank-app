import React, { useEffect } from 'react';
import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import InputField from '../../components/input-field/InputField';
import { FormikProps } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { ProfileCredentialsModel } from '../../models/ProfileCredentialsModel';
import { COLORS } from '../../constants';

const SignInForm = (props: FormikProps<ProfileCredentialsModel>) => {

  StatusBar.setBarStyle('dark-content');

  const navigation = useNavigation();

  const {
    handleSubmit,
    isValid,
    errors,
    touched,
    resetForm
  } = props;

  return (
    <SafeAreaView style={styles.style}>
      <KeyboardAwareScrollView
        style={{ backgroundColor: '#ffffff' }}
        contentContainerStyle={styles.container}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}>
        <Image source={require('../../images/logo/logomark.png')}
               style={styles.logo} />
        <View style={styles.inputGroup}>
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
          <InputField
            name='password'
            formik={props}
            label='Password'
            placeholder='Enter your password'
            autoCapitalize='none'
            textContentType='password'
            keyboardType='default'
            secureTextEntry={true}
            leftIcon={{
              name: 'lock-outline',
              type: 'material-community',
              color: (touched.password && errors.password)? COLORS.error : COLORS.primary,
            }}
          />
          <TouchableOpacity>
            <Text style={styles.linkForgotten} onPress={() => {
              resetForm()
              navigation.navigate('ResetPasswordEmail')
            }}>
              Forgotten password?
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Button
            title="Sign In"
            containerStyle={styles.btSignIn}
            disabled={!isValid}
            onPressOut={() => {
              handleSubmit();
            }}
          />
          <View style={styles.signUp}>
            <Text>Don't you have a profile yet?</Text>
            <TouchableOpacity onPress={() => {
              resetForm()
              navigation.navigate('Terms');
            }}>
              <Text style={styles.linkSignUp}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  style: {
    backgroundColor: COLORS.secondary,
    height: '100%',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  logo: {
    alignSelf: 'center',
    width: 200,
    height: 210,
    marginTop: '25%',
  },
  inputGroup: {
    width:'90%',
    alignSelf: 'center',
  },
  btSignIn: {
    width: '85%',
    alignSelf: 'center',
  },
  linkForgotten: {
    color: COLORS.ternary,
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  signUp: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkSignUp: {
    color: COLORS.ternary,
    paddingLeft: 5,
    padding:10,
    fontWeight: 'bold',
  },
});

export default SignInForm;