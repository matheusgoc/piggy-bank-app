import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import ProfileService from '../../services/ProfileService';
import ProfileForm from './ProfileForm';
import { ProfileModel } from '../../models/ProfileModel';
import { US_STATES } from '../../constants';

const profileService = new ProfileService();

const Profile = withFormik<ProfileModel, ProfileModel>({

  mapPropsToValues: props => {

    // map profile from storage
    profileService.syncFromStore();
    let profile = profileService.get();

    // set gender
    if (profile.gender) {
      profile.gender = {label: (profile.gender == 'M')? 'Male' : 'Female', value: profile.gender};
    }

    // set state
    if (profile.state) {
      profile.state = {abbr: profile.state, name: US_STATES[profile.state]}
    }

    return profile;
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

  handleSubmit: (profile: ProfileModel, bag:any)  => {

    // set profile on storage
    profileService.setPersonalInfo({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      gender: profile.gender.value,
      birthday: profile.birthday,
      state: profile.state.abbr,
      city: profile.city,
      postalCode: profile.postalCode,
    });
    profileService.store();

    bag.props.navigation.navigate('Savings');
  },

})(ProfileForm);

export default Profile;