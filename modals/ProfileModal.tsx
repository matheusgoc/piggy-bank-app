export class ProfileModal {
  id: number = null;
  user_id: number = null;
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
  balanceSignal: string = 'saved';
  targetTotalSavings: number = 0;
  targetMonthlySavings: number = 0;
}