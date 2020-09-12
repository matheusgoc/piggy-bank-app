export class ProfileModel {
  id: number = null;
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  gender: string = '';
  birthday: Date = null;
  state: string = '';
  city: string = '';
  postalCode: string = '';
  balance: number = 0;
  balanceSignal: 'saved'|'owed' = 'saved';
  targetTotalSavings: number = 0;
  targetMonthlySavings: number = 0;
}