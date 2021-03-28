import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FormikProps } from 'formik'
import { Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import InputDateTimePicker from '../../components/input-date-time-picker/InputDateTimePicker'
import { COLORS, US_STATES } from '../../constants'
import InputField from '../../components/input-field/InputField'
import { ProfileModel } from '../../models/ProfileModel'
import DropDownOverlay from '../../components/drop-down/DropDownOverlay'
import moment from 'moment'

const ProfileForm = (props: FormikProps<ProfileModel>) => {

  const {
    handleSubmit,
    values,
    isValid,
  } = props

  const navigation = useNavigation()
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: values.id? 'Update my profile' : 'Create my profile',
    })
  }, [navigation, values.id])

  const initialStates = Object.entries(US_STATES).map(([abbr, name]) => {
    return {abbr, name}
  })
  const [states, setStates] = useState(initialStates)

  const searchStates = (search) => {
    let statesList = []
    Object.entries(US_STATES).map(([abbr, name]) => {
      if (name.indexOf(search) >= 0) {
        statesList.push({abbr, name})
      }
    })
    setStates(statesList)
  }

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
              disabled={!!values.id}
            />
          </View>
          <View style={styles.row}>
            <DropDownOverlay
              name='gender'
              formik={props}
              label='Gender'
              items={[
                {label: 'Male', value: 'M'},
                {label: 'Female', value: 'F'},
              ]}
              id='value'
              searchKey='label'
              placeholder='--'
              width='50%'
              icon={{
                name: 'caret-down',
                type: 'font-awesome',
              }}
            />
            <InputDateTimePicker
              name='birthday'
              mode='date'
              label='Birthday'
              width='50%'
              formik={props}
              maximumDate={new Date()}
              default={moment().subtract(20, 'years').date(1).month(0).toDate()}
            />
          </View>
          <View style={styles.row}>
            <DropDownOverlay
              name='state'
              formik={props}
              label='State'
              items={states}
              id='abbr'
              searchKey='name'
              placeholder='--'
              width='50%'
              onSearch={searchStates}
              icon={{
                name: 'caret-down',
                type: 'font-awesome',
              }}
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
              keyboardType='number-pad'
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
            title={(values.id)? 'Save' : 'Next'}
            disabled={!isValid}
            onPressOut={() => {
              handleSubmit()
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

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
})

export default ProfileForm