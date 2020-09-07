import React from 'react';
import { FormikErrors, withFormik } from 'formik';
import * as Yup from 'yup';
import ProfileService from '../../services/ProfileService';
import PasswordForm from './PasswordForm';
import { ProfilePasswordModal } from '../../modals/ProfilePasswordModal';

const profileService = new ProfileService();

const Password = withFormik<ProfilePasswordModal, ProfilePasswordModal>({

  mapPropsToValues: props => {

    // reset password fields
    return new ProfilePasswordModal();
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
    let errors: FormikErrors<ProfilePasswordModal> = {};
    if (values.password && values.password.length >= 6 && values.strength < .75) {
      errors.password = 'Too week'
    }

    return errors;
  },

  handleSubmit: (profilePassword: ProfilePasswordModal, bag:any)  => {

    console.log("profile's password", [profilePassword]);

    // profileService.store();
    // bag.props.navigation.navigate('Savings');
  },

})(PasswordForm);

export default Password;