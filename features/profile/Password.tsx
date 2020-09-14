import React from 'react';
import { FormikErrors, withFormik } from 'formik';
import * as Yup from 'yup';
import { toggleLoading } from '../navigation/NavigationSlice'
import PasswordForm from './PasswordForm';
import { ProfilePasswordModel } from '../../models/ProfilePasswordModel';
import { store } from '../../store';
import { setOnboard } from './ProfileSlice';
import ProfileServiceApi from '../../services/ProfileServiceApi';
import { TOAST } from '../../constants';

const Password = withFormik<ProfilePasswordModel, ProfilePasswordModel>({

  mapPropsToValues: props => {

    // reset password fields
    return new ProfilePasswordModel();
  },

  validationSchema: Yup.object().shape({
    password: Yup.string()
      .min(6, 'Too short')
      .required('Required'),
    confirmation: Yup.string()
      .oneOf([Yup.ref('password')], 'Password does not match')
      .required('Required'),
  }),

  validate: (values) => {
    let errors: FormikErrors<ProfilePasswordModel> = {};
    if (values.password && values.password.length >= 6 && values.strength < .75) {
      errors.password = 'Too week'
    }

    return errors;
  },

  handleSubmit: (profilePassword: ProfilePasswordModel, bag:any)  => {

    const profileServiceApi = new ProfileServiceApi();
    profileServiceApi.syncFromStore();
    profileServiceApi.setPassword(profilePassword);
    store.dispatch(toggleLoading());
    profileServiceApi.save().then(() => {
      store.dispatch(setOnboard(false));
      TOAST.ref.alertWithType(
        'success',
        'Your profile was created!',
        'Sign in with your email and password to access your account!',
        null,
        5000
      );
      bag.props.navigation.navigate('SignIn');
    }).catch((error: Error) => {
      console.warn('Password.handleSubmit: ' + error.message);
    }).finally(() => {
      store.dispatch(toggleLoading());
    });
  },

})(PasswordForm);

export default Password;