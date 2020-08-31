import React from 'react';
import { SafeAreaView, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormikProps, withFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from 'react-native-elements';
import InputDateTimePicker from '../../components/input-date-time-picker/InputDateTimePicker';
import DropDown from '../../components/drop-down/DropDown';
import { MASKS, US_STATES } from '../../constants';
import InputField from '../../components/input-field/InputField';

interface Profile {
  firstName?: string,
  lastName?: string,
  email?: string,
  gender?: string,
  birthday?: Date | string,
  state?: string,
  city?: string,
  postalCode?: string
}

const ProfileForm = (props: FormikProps<Profile>) => {

  const {
    handleSubmit,
    values,
    setFieldValue,
  } = props;

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView
        style={styles.style}
        contentContainerStyle={styles.container}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}>
        <View style={styles.col}>
          <InputField
            name='firstName'
            formik={props}
            label='* First Name'
            placeholder='Enter first name'
            autoCapitalize='words'
            textContentType='givenName'
            keyboardType='ascii-capable'
            value={values.firstName}
            width='50%'
          />
          <InputField
            name='lastName'
            formik={props}
            label='* Last Name'
            placeholder='Enter last name'
            textContentType='familyName'
            keyboardType='ascii-capable'
            value={values.lastName}
            width='50%'
          />
        </View>
        <View>
          <InputField
            name='email'
            formik={props}
            label='* Email'
            placeholder='Enter your email'
            textContentType='emailAddress'
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
            autoCompleteType='email'
            value={values.email}
          />
        </View>
        <View style={[styles.col,{zIndex:11}]}>
          <DropDown
            name='gender'
            formik={props}
            label='Gender'
            width='50%'
            items={[
              {label: 'Male', value: 'male'},
              {label: 'Female', value: 'female'},
            ]}
            value={values.gender}
          />
          <InputDateTimePicker
            mode='date'
            label='Birthday'
            value={values.birthday}
            width='50%'
            name='birthday'
            formik={props}
          />
        </View>
        <View style={[styles.col,{zIndex:10}]}>
          <DropDown
            name='state'
            formik={props}
            label='State'
            items={states}
            value={values.state}
            searchable={true}
            width='50%'
          />
          <InputField
            name='city'
            formik={props}
            label='City'
            placeholder='City name'
            textContentType='addressCity'
            keyboardType='ascii-capable'
            value={values.city}
            width='50%'
          />
        </View>
        <View>
          <InputField
            name='postalCode'
            formik={props}
            label='Zip Code'
            placeholder='Enter Zip Code'
            textContentType='postalCode'
            keyboardType='numbers-and-punctuation'
            value={values.postalCode}
            width='50%'
            onChangeText={(value) => {
              setFieldValue('postalCode', MASKS.zipcode.resolve(value));
            }}
          />
        </View>
      </KeyboardAwareScrollView>
      <Button
        title='Next'
        containerStyle={styles.btSave}
        onPress={() => {
          handleSubmit();
        }}
      />
    </SafeAreaView>
  )
}

const states = Object.entries(US_STATES).map(([abbr, name]) => {
  return {label: abbr, value: abbr, name}
});

const styles = StyleSheet.create({
  style: {
    backgroundColor: 'white',
  },
  container: {
    marginTop: 10,
    height: '100%'
  },
  col: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  col50: {
    width: '50%',
  },
  btSave: {
    position: 'absolute',
    bottom: 40,
    width: '90%',
    alignSelf: 'center',
  }
});

const Profile = withFormik<Profile, Profile>({

  mapPropsToValues: props => {
    return {
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      birthday: '',
      state: '',
      city: '',
      postalCode: '',
    };
  },

  validationSchema: Yup.object({
    firstName: Yup.string()
      .max(15, 'Must be 15 characters or less')
      .required('Required'),
    lastName: Yup.string()
      .max(20, 'Must be 20 characters or less')
      .required('Required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Required'),
    gender: Yup.string()
      .required('Required')
  }),

  handleSubmit: values => {
    console.log(values);
  },

})(ProfileForm);

export default Profile;