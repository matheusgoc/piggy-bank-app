import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormikProps } from 'formik';
import { Button } from 'react-native-elements';
import InputDateTimePicker from '../../components/input-date-time-picker/InputDateTimePicker';
import DropDown from '../../components/drop-down/DropDown';
import { COLORS, US_STATES } from '../../constants';
import InputField from '../../components/input-field/InputField';
import { ProfileModal } from '../../modals/ProfileModal';

const ProfileForm = (props: FormikProps<ProfileModal>) => {

  const {
    handleSubmit,
    values,
    isValid,
  } = props;

  return (
    <SafeAreaView style={styles.style}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}>
        <View>
          <View style={styles.row}>
            <InputField
              name='firstName'
              formik={props}
              label='* First Name'
              placeholder='Enter first name'
              autoCapitalize='words'
              textContentType='givenName'
              keyboardType='ascii-capable'
              width='50%'
            />
            <InputField
              name='lastName'
              formik={props}
              label='* Last Name'
              placeholder='Enter last name'
              textContentType='familyName'
              keyboardType='ascii-capable'
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
            />
          </View>
          <View style={[styles.row,{zIndex:11}]}>
            <DropDown
              name='gender'
              formik={props}
              label='Gender'
              width='50%'
              items={[
                {label: '--', value: ''},
                {label: 'Male', value: 'male'},
                {label: 'Female', value: 'female'},
              ]}
            />
            <InputDateTimePicker
              name='birthday'
              mode='date'
              label='Birthday'
              width='50%'
              formik={props}
            />
          </View>
          <View style={[styles.row,{zIndex:10}]}>
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
              width='50%'
              mask='zipcode'
            />
          </View>
        </View>
        <View style={styles.save}>
          <Text style={styles.required}>
            * required
          </Text>
          <Button
            title='Next'
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

const blankState = {label: '--', value: ''};
const states = Object.entries(US_STATES).map(([abbr, name]) => {
  return {label: abbr, value: abbr, name}
});

const styles = StyleSheet.create({
  style: {
    backgroundColor: 'white',
  },
  container: {
    paddingTop: 5,
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  save: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  required: {
    color: COLORS.error,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingBottom: 10,
    paddingRight: 10,
  }
});

export default ProfileForm;