import React from 'react';
import { withFormik } from 'formik';
import { ProfileModel } from '../../models/ProfileModel';
import SavingsForm from './SavingsForm';
import { store } from '../../store';
import { setAction } from '../navigation/NavigationSlice';
import { ACTIONS, TOAST } from '../../constants';
import ProfileServiceApi from '../../services/ProfileServiceApi';
import { showLoading, unformatCurrency } from '../../helpers';

const profileService = new ProfileServiceApi();

const Savings = withFormik<ProfileModel, ProfileModel>({

  mapPropsToValues: props => {

    // map profile from storage
    profileService.syncFromStore();
    const profile = profileService.get();

    // set balance
    profile.balance = Math.abs(profile.balance);

    // set balance signal
    profile.balanceSignal = (profile.balanceSignal === 'saved')
      ? {label: 'Saved', value: 'saved'}
      : {label: 'Owed', value: 'owed'};

    return profile;
  },

  handleSubmit: (profile: ProfileModel, bag:any)  => {

    // change balance value according to signal
    if (profile.balanceSignal === 'owed' && profile.balance > 0) {
      profile.balance = -profile.balance;
    }

    // set profile on storage
    profileService.setSavings({
      balance: profile.balance,
      balanceSignal: profile.balanceSignal.value,
      targetTotalSavings: profile.targetTotalSavings,
      targetMonthlySavings: profile.targetMonthlySavings,
    });
    profileService.store();
    // profile = profileService.get();

    // update
    if (profile.id) {

      showLoading(true);
      profileService.save().then(() => {

        TOAST.ref.alertWithType(
          'success',
          "Your profile's savings has been updated",
          '',
        );

        bag.props.navigation.goBack();

      }).catch((error: Error) => {
        console.warn('Savings.handleSubmit: ' + error.message);
      }).finally(() => {
        showLoading(false);
      });

    // create
    } else {

      store.dispatch(setAction(ACTIONS.CREATE_PROFILE));
      bag.props.navigation.navigate('Password');
    }
  },

})(SavingsForm);

export default Savings;