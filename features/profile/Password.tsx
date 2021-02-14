import React from 'react';
import { FormikErrors, withFormik } from 'formik';
import * as Yup from 'yup';
import PasswordForm from './PasswordForm';
import { ProfilePasswordModel } from '../../models/ProfilePasswordModel';
import { store } from '../../store';
import { setOnboard } from './ProfileSlice';
import ProfileServiceApi from '../../services/ProfileServiceApi';
import { ACTIONS, TOAST } from '../../constants';
import { RootNavigation, showLoading } from '../../helpers';
import { getAction } from '../navigation/NavigationSlice';

export interface PasswordProps {
  route: {
    params: any
  }
}

const Password = withFormik<PasswordProps, ProfilePasswordModel>({

  mapPropsToValues: () => {

    // reset password fields
    return new ProfilePasswordModel();
  },

  validationSchema: () => {
    const action = getAction(store.getState());
    const validation = {
      password: Yup.string()
        .min(6, 'Too short')
        .required('Required'),
      confirmation: Yup.string()
        .oneOf([Yup.ref('password')], 'Password does not match')
        .required('Required'),
    };
    if (action == ACTIONS.CHANGE_PASSWORD) {
      validation['current'] = Yup.string().required('Required');
    }

    return Yup.object().shape(validation);
  },

  validate: (values) => {
    let errors: FormikErrors<ProfilePasswordModel> = {};
    if (values.password && values.password.length >= 6 && values.strength < .75) {
      errors.password = 'Too week'
    }

    return errors;
  },

  handleSubmit: (profilePassword: ProfilePasswordModel, bag:any)  => {

    const action = getAction(store.getState());

    const profileServiceApi = new ProfileServiceApi();
    const params = bag.props.route?.params;

    showLoading(true);
    switch (action) {

      // reset password with email and PIN
      case ACTIONS.RESET_PASSWORD:
      case ACTIONS.RESET_PASSWORD_LOGGED:
        const {email, pin} = params;
        const password = profilePassword.password;
        profileServiceApi.changePasswordWithPIN(email, pin, password).then(() => {

          TOAST.ref.alertWithType(
            'success',
            'Your password has been changed',
            (action == ACTIONS.RESET_PASSWORD)
              ? 'Sign in with your email and new password to access your account' : '',
            null,
            (action == ACTIONS.RESET_PASSWORD)? 8000 : 3000
          );

          const view = (action == ACTIONS.RESET_PASSWORD_LOGGED)? 'Settings' : 'SignIn';
          bag.props.navigation.navigate(view);

        }).catch((error: Error) => {
          console.warn('Password.handleSubmit: ' + error.message);
        }).finally(() => {
          showLoading(false);
        });
        break;

      // change the password by checking the old one
      case ACTIONS.CHANGE_PASSWORD:
        const oldPassword = profilePassword.current;
        const newPassword = profilePassword.password;
        profileServiceApi.changePassword(oldPassword, newPassword).then(() => {

          TOAST.ref.alertWithType(
            'success',
            'Your password has been changed',
            '',
          );

          bag.props.navigation.goBack();

        }).catch((error: Error) => {
          console.warn('Password.handleSubmit: ' + error.message);
        }).finally(() => {
          showLoading(false);
        });
        break;

      // register a new profile
      case ACTIONS.CREATE_PROFILE:
        profileServiceApi.syncFromStore();
        profileServiceApi.setPassword(profilePassword);
        profileServiceApi.save().then(() => {

          store.dispatch(setOnboard(false));
          TOAST.ref.alertWithType(
            'success',
            'Your profile was created!',
            'Sign in with your email and password to access your account!',
            null,
            8000
          );

          RootNavigation.reset('SignIn');

        }).catch((error: Error) => {
          console.warn('Password.handleSubmit: ' + error.message);
        }).finally(() => {
          showLoading(false);
        });
    }
  },

})(PasswordForm);

export default Password;