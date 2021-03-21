import BaseService from './BaseService';
import { InstitutionModel } from '../models/InstitutionModel';
import {
  setInstitutions,
  addInstitution,
  removeInstitution,
  setInstitutionIndex,
} from '../features/banking/BankingSlice';

export default class BankingService extends BaseService {
  constructor() {
    super();
  }

  set(institutions: InstitutionModel[]) {
    this.dispatch(setInstitutions(institutions))
  }

  add(institution: InstitutionModel) {
    this.dispatch(addInstitution(institution))
  }

  remove(index) {
    this.dispatch(removeInstitution(index))
  }

  setIndex(index) {
    this.dispatch(setInstitutionIndex(index))
  }
}