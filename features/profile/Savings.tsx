import React from 'react';
import { withFormik } from 'formik';
import ProfileService from '../../services/ProfileService';
import { ProfileModel } from '../../models/ProfileModel';
import SavingsForm from './SavingsForm';

const profileService = new ProfileService();

const Savings = withFormik<ProfileModel, ProfileModel>({

  mapPropsToValues: props => {

    // map profile from storage
    profileService.syncFromStore();

    return profileService.get();
  },

  handleSubmit: (profile: ProfileModel, bag:any)  => {

    // change balance signal
    if (profile.balanceSignal === 'owed' && profile.balance > 0) {
      profile.balance = -profile.balance;
    }

    // set profile on storage
    profileService.setSavings({
      balance: profile.balance,
      balanceSignal: profile.balanceSignal,
      targetTotalSavings: profile.targetTotalSavings,
      targetMonthlySavings: profile.targetMonthlySavings,
    });
    profileService.store();

    bag.props.navigation.navigate('Password');
  },

})(SavingsForm);

export default Savings;