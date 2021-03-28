import React from 'react'
import { withFormik } from 'formik'
import * as Yup from 'yup'
import SignInForm from './SignInForm'
import { ProfileCredentialsModel } from '../../models/ProfileCredentialsModel'
import ProfileServiceApi from '../../services/ProfileServiceApi'
import { TOAST } from '../../constants'
import { RootNavigation, showLoading } from '../../helpers'

const SignIn = withFormik<ProfileCredentialsModel, ProfileCredentialsModel>({

  mapPropsToValues: () => {

    return new ProfileCredentialsModel()
  },

  validationSchema: Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Required'),
    password: Yup.string()
      .required('Required'),
  }),

  handleSubmit: (credentials: ProfileCredentialsModel)  => {

    const profileServiceApi = new ProfileServiceApi()
    showLoading(true)
    profileServiceApi.signIn(credentials.email, credentials.password).then(function () {

      const profile = profileServiceApi.get()
      TOAST.ref.alertWithType('info',
        'Hi ' + profile.lastName + ',',
        'you are welcome!')

      RootNavigation.reset('Main')

    }).catch((error) => {
      console.warn('SigIn.handleSubmit: ' + error)
    }).finally(() => {
      showLoading(false)
    })
  },

})(SignInForm)

export default SignIn