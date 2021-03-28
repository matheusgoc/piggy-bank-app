export class ProfileSavingsModel {
  balance: number = 0
  balanceSignal: 'saved'|'owed' = 'saved'
  targetTotalSavings: number = 0
  targetMonthlySavings: number = 0
}