import React from 'react';
import { FormikErrors, withFormik } from 'formik';
import * as Yup from 'yup';
import PasswordForm from './PasswordForm';
import { ProfilePasswordModel } from '../../models/ProfilePasswordModel';
import { store } from '../../store';
import { setOnboard } from './ProfileSlice';
import ProfileServiceApi from '../../services/ProfileServiceApi';
import { ACTIONS, TOAST } from '../../constants';
import { showLoading } from '../../helpers';

export interface PasswordProps {
  route: {
    params: any
  }
}

const Password = withFormik<PasswordProps, ProfilePasswordModel>({

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
    const params = bag.props.route?.params;

    // reset password with email and PIN
    if (params?.action == ACTIONS.RESET_PASSWORD) {

      const {email, pin} = params;
      const password = profilePassword.password;
      profileServiceApi.changePasswordWithPIN(email, pin, password).then(() => {

        TOAST.ref.alertWithType(
          'success',
          'Your password has been changed!',
          'Sign in with your email and new password to access your account!',
          null,
          5000
        );

        bag.props.navigation.navigate('SignIn');

      }).catch((error: Error) => {
        console.warn('Password.handleSubmit: ' + error.message);
      }).finally(() => {
        showLoading(false);
      });

    // register a new profile
    } else {

      profileServiceApi.syncFromStore();
      profileServiceApi.setPassword(profilePassword);
      showLoading(true);
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
        showLoading(false);
      });
    }
  },

})(PasswordForm);

export default Password;