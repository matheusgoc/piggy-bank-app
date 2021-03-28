import React from 'react'
import { withFormik } from 'formik'
import * as Yup from 'yup'
import { setAction } from '../navigation/NavigationSlice'
import ProfileServiceApi from '../../services/ProfileServiceApi'
import { showLoading } from '../../helpers'
import ResetPasswordForm from './ResetPasswordEmailForm'
import { store } from '../../store'
import { ACTIONS } from '../../constants'

const ResetPasswordEmail = withFormik<{email: string}, {email: string}>({

  mapPropsToValues: props => {

    return {email: props.email}
  },

  validationSchema: Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Required'),
  }),

  handleSubmit: (credentials: {email: string}, bag:any)  => {

    const profileServiceApi = new ProfileServiceApi()
    showLoading(true)
    profileServiceApi.requestPIN(credentials.email).then(function () {

      store.dispatch(setAction(ACTIONS.RESET_PASSWORD))
      bag.props.navigation.navigate('ResetPasswordPIN', { email: credentials.email })

    }).catch((error) => {
      console.warn('ResetPasswordEmail.handleSubmit: ' + error)
    }).finally(() => {
      showLoading(false)
    })
  },

})(ResetPasswordForm)

export default ResetPasswordEmail