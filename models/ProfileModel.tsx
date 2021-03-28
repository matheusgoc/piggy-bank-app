export class ProfileModel {
  id: number = null
  email: string = ''
  password: string = ''
  firstName: string = ''
  lastName: string = ''
  gender: 'M' | 'F' | {label: 'Male' | 'Female', value: 'M' | 'F'} | any = ''
  birthday: Date = null
  state: string | {abbr: string, name: string} | any = ''
  city: string = ''
  postalCode: string = ''
  balance: number = 0
  balanceSignal: 'saved' | 'owed' | {label: string, value: 'saved' | 'owed'} | any= 'saved'
  targetTotalSavings: number = 0
  targetMonthlySavings: number = 0
}