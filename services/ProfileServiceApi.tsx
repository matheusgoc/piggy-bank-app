import ProfileService from './ProfileService';
import BaseService from './BaseService';
import { ProfileModel } from '../models/ProfileModel';
import moment from 'moment';
import { HTTP_STATUS } from '../constants';
import SyncService from './SyncService';
import TransactionsService from './TransactionsService';
import ReportService from './ReportService';
import CategoriesService from './CategoriesService';
import { store } from '../store';

/**
 * ProfileServiceApi
 * A service to handle the profile's persistence at the API web service
 *
 * @extends ProfileService
 */
export default class ProfileServiceApi extends ProfileService {

  constructor(profile?: ProfileModel) {
    super(profile);
  }

  /**
   * Retrieves the user's profile
   */
  async load():Promise<void> {
    try {

      const res = await this.api.get('profile');
      this.mapToStore(res.data);

    } catch (error) {

      const method = 'ProfileServiceApi.load';
      let msg = 'Server error in attempt to load profile';
      this.handleHttpError(method, msg, error, false);
    }
  }

  /**
   * Authenticate the user
   *
   * @param email
   * @param password
   */
  async signIn(email:string, password:string):Promise<void> {
    try {

      const res = await this.api.post('profile/auth', {
        email,
        password,
        device: 'device'
      });

      if (res.status === HTTP_STATUS.OK) {
        this.setToken(res.data.token);
        this.storeToken();
        this.mapToStore(res.data.profile);
        await SyncService.load(true);
      }

    } catch (error) {
      const method = 'ProfileServiceApi.signIn';
      let msg = 'The authentication has fail due to a server error!';
      if (error.response && error.response.status == HTTP_STATUS.FORBIDDEN) {
        msg = 'The email or password is invalid!';
      }
      this.handleHttpError(method, msg, error);
    }
  }

  /**
   * Persist the user
   */
  async save():Promise<void> {

    try {

      let profileToSave = this.mapToApi();
      let uri = 'profile';

      // update
      if (profileToSave['id']) {

        delete(profileToSave['password']);
        const res = await this.api.put(uri, profileToSave);
        this.mapToStore(res.data);

      // create
      } else {

        await this.api.post(uri, profileToSave);
        this.profile = null;
        this.store();
      }

    } catch (error) {

      const method = 'ProfileServiceApi.save';
      let msg = 'Unable to save the profile due a server error. Try again later!';
      if (error.response && error.response.status == HTTP_STATUS.CONFLICT) {
        msg = 'A profile with the same email already exists';
      }
      this.handleHttpError(method, msg, error);
    }
  }

  async requestPIN(email: string)
  {
    try {

      await this.api.patch('profile/reset-password', {email});

    } catch (error) {

      const method = 'ProfileServiceApi.requestPIN';
      let msg = 'Unable to request PIN to reset your password!';
      if (error.response) {
        switch (error.response.status) {
          case HTTP_STATUS.FORBIDDEN: msg = 'The given email is not registered'; break;
        }
      }

      this.handleHttpError(method, msg, error);
    }
  }

  async confirmPIN(pin: number, email: string)
  {
    try {

      await this.api.patch('profile/refresh-pin-time', {email, pin});

    } catch (error) {

      const method = 'ProfileServiceApi.confirmPIN';
      let msg = 'Unable to confirm the PIN!';
      if (error.response) {
        switch (error.response.status) {
          case HTTP_STATUS.UNAUTHORIZED: msg = 'The PIN is not valid'; break;
          case HTTP_STATUS.REQUEST_TIMEOUT: msg = 'The PIN has been expired.'; break;
        }
      }
      this.handleHttpError(method, msg, error);
    }
  }

  async changePasswordWithPIN(email, pin, password)
  {
    try {

      await this.api.patch('profile/change-password-with-pin', {email, pin, password});

    } catch (error) {

      const method = 'ProfileServiceApi.changePasswordWithPIN';
      let msg = 'Unable to change the password';
      if (error.response) {
        switch (error.response.status) {
          case HTTP_STATUS.UNAUTHORIZED: msg = 'The PIN is not valid'; break;
          case HTTP_STATUS.REQUEST_TIMEOUT: msg = 'The PIN has been expired'; break;
        }
      }
      this.handleHttpError(method, msg, error);
    }
  }

  async changePassword(oldPassword, newPassword)
  {
    try {

      await this.api.patch('profile/change-password', {
        password: oldPassword,
        new: newPassword
      });

    } catch (error) {

      const method = 'ProfileServiceApi.changePasswordWithPIN';
      let msg = 'Unable to change the password';
      if (error.response) {
        switch (error.response.status) {
          case HTTP_STATUS.FORBIDDEN: msg = 'The current password is not valid'; break;
        }
      }
      this.handleHttpError(method, msg, error);
    }
  }

  /**
   * Update the current profile with the data saved in the server
   */
  async syncFromServer():Promise<void> {
    try {

      const res = await this.api.get('profile');
      this.mapToStore(res.data);

    } catch(error) {

      const method = 'ProfileServiceApi.syncFromServer';
      const msg = 'Unable to retrieve the profile from the server';
      this.handleHttpError(method, msg, error);
    }
  }

  /**
   * Format profile to save it in the server
   *
   * @private
   */
  private mapToApi(): object {
    return {
      'id': this.profile.id,
      'email': this.profile.email,
      'password': this.profile.password,
      'firstname': this.profile.firstName,
      'lastname': this.profile.lastName,
      'gender': this.profile.gender,
      'birthday': (this.profile.birthday)? moment(this.profile.birthday).format('YYYY-MM-DD'): null,
      'state': this.profile.state,
      'city': this.profile.city,
      'postalcode': this.profile.postalCode,
      'balance': this.profile.balance,
      'target_total_savings': this.profile.targetTotalSavings,
      'target_monthly_savings': this.profile.targetMonthlySavings,
    }
  }

  /**
   * Set the profiles object from the server
   *
   * @param profile
   * @private
   */
  private mapToStore(profile): void {
    this.set({
      id: profile['id'],
      email: profile['email'],
      firstName: profile['firstname'],
      lastName: profile['lastname'],
      gender: profile['gender'],
      birthday: (profile['birthday'])? new Date(profile['birthday']) : null,
      state: profile['state'],
      city: profile['city'],
      postalCode: profile['postalcode'],
      balance: profile['balance'],
      balanceSignal: (profile['balance'] < 0)? 'owed' : 'saved',
      targetTotalSavings: profile['target_total_savings'],
      targetMonthlySavings: profile['target_monthly_savings'],
      password: null,
    });
    this.store();
  }
}