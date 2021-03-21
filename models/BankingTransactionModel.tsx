export class BankingTransactionModel {
  id: string
  amount: number
  isPending: boolean
  channel: string
  name: string
  merchantName: string
  date: string
  categories: string[]
  currency: string
  location: {
    address: string,
    city: string,
    region: string,
    postalCode: number,
    country: string,
    lat: number,
    lon: number,
    storeNumber: number
  }
}
