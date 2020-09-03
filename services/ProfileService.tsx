import BaseService, { IService } from './BaseService';
import { getProfile, setProfile } from '../features/profile/ProfileSlice';
import { store } from '../store';
import { ProfileModal } from '../modals/ProfileModal';

export default class ProfileService extends BaseService implements IService {

  private profile: ProfileModal;

  constructor(profile?: ProfileModal) {
    super();
    this.set((profile)? profile : new ProfileModal());
  }

  store() {
    store.dispatch(setProfile(this.get()));
  }

  syncFromStore() {
    this.set({...getProfile(store.getState())});
  }

  get(): ProfileModal {

    return this.profile;
  }

  set(profile: ProfileModal): void {
    this.profile = (profile)? profile : new ProfileModal();
    this.castBirthdayToDate();
  }

  private castBirthdayToDate() {
    if(this.profile.birthday && typeof(this.profile.birthday) === 'string') {
      this.profile.birthday = new Date(this.profile.birthday);
    }
  }
}