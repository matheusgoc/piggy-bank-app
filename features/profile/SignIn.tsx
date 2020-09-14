import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import SignInForm from './SignInForm';
import { ProfileCredentialsModel } from '../../models/ProfileCredentialsModel';
import ProfileServiceApi from '../../services/ProfileServiceApi';
import { TOAST } from '../../constants';
import { store } from '../../store';
import { toggleLoading } from '../navigation/NavigationSlice';

const SignIn = withFormik<ProfileCredentialsModel, ProfileCredentialsModel>({

  mapPropsToValues: props => {

    return new ProfileCredentialsModel();
  },

  validationSchema: Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Required'),
    password: Yup.string()
      .required('Required'),
  }),

  handleSubmit: (credentials: ProfileCredentialsModel, bag:any)  => {

    const profileServiceApi = new ProfileServiceApi();
    store.dispatch(toggleLoading());
    profileServiceApi.signIn(credentials.email, credentials.password).then(function () {

      const profile = profileServiceApi.get();
      TOAST.ref.alertWithType('info',
        'Hi ' + profile.lastName + ',',
        'you are welcome!');

    }).catch((error) => {
      console.warn('SigIn.handleSubmit: ' + error);
    }).finally(() => {
      store.dispatch(toggleLoading());
    });
  },

})(SignInForm);

export default SignIn;