import BaseService, { IService } from './BaseService'
import { getProfile, setProfile, setToken } from '../features/profile/ProfileSlice'
import { store } from '../store'
import { ProfileModel } from '../models/ProfileModel'
import { ProfilePersonalInfoModel } from '../models/ProfilePersonalInfoModel'
import { ProfileSavingsModel } from '../models/ProfileSavingsModel'
import { ProfilePasswordModel } from '../models/ProfilePasswordModel'

/**
 * ProfileService
 * A service to handle the profile's state persistence
 *
 * @extends BaseService
 */
export default class ProfileService extends BaseService implements IService {

  protected profile: ProfileModel

  /**
   * Generate a new profile
   *
   * @param profile
   */
  constructor(profile?: ProfileModel) {
    super()
    this.set((profile)? profile : new ProfileModel())
  }

  /**
   * Store the profile's data
   */
  store() {
    const profile = this.get()
    if (profile) {
      profile.password = ''
    }
    store.dispatch(setProfile(profile))
  }

  /**
   * Store the profiles token
   * @protected
   */
  protected storeToken() {
    store.dispatch(setToken(BaseService.token))
  }

  /**
   * Updates the current profile with the data stored
   */
  syncFromStore() {
    this.set(getProfile(store.getState()))
  }

  /**
   * Retrieves profile
   */
  get(): ProfileModel {

    return this.profile
  }

  /**
   * Set the profile
   * @param profile
   */
  set(profile: ProfileModel): void {
    this.profile = (profile)? {...this.profile,...profile} : new ProfileModel()
    this.castBirthdayToDate()
  }

  /**
   * Set the profile's personal data portion
   * @param personalInfo
   */
  setPersonalInfo(personalInfo: ProfilePersonalInfoModel): void {
    this.syncFromStore()
    this.profile = {...this.profile,...personalInfo}
    this.castBirthdayToDate()
  }

  /**
   * Set the profile's savings data portion
   * @param savings
   */
  setSavings(savings: ProfileSavingsModel): void {
    this.syncFromStore()
    this.profile = {...this.profile,...savings}
  }

  /**
   * Set the profile's password
   * @param profilePassword
   */
  setPassword(profilePassword: ProfilePasswordModel): void {
    this.syncFromStore()
    this.profile.password = profilePassword.password
  }

  /**
   * Cast the birthday to date type
   * @protected
   */
  private castBirthdayToDate() {
    if(this.profile.birthday && typeof(this.profile.birthday) === 'string') {
      this.profile.birthday = new Date(this.profile.birthday)
    }
  }
}