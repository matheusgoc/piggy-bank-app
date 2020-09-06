import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import ProfileService from '../../services/ProfileService';
import ProfileForm from './ProfileForm';
import { ProfileModal } from '../../modals/ProfileModal';

const profileService = new ProfileService();

const Profile = withFormik<ProfileModal, ProfileModal>({

  mapPropsToValues: props => {

    // map profile from storage
    profileService.syncFromStore();

    return profileService.get();
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
  }),

  handleSubmit: (profile: ProfileModal, bag:any)  => {

    // set profile on storage
    profileService.setPersonalInfo({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      gender: profile.gender,
      birthday: profile.birthday,
      state: profile.state,
      city: profile.city,
      postalCode: profile.postalCode,
    });
    profileService.store();

    bag.props.navigation.navigate('Savings');
  },

})(ProfileForm);

export default Profile;