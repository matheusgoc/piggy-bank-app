import { CategoryModel } from './CategoryModel';

export class TransactionModel {
  id: number = null;
  key: string;
  type: 'I' | 'E' | {label: string, value: 'I' | 'E'} | any = 'E';
  category: CategoryModel = { id: null, name: '', isNew: false }
  amount: number = null;
  place: string = '';
  description: string = '';
  receipt: string = '';
  isNewReceipt: boolean = false;
  orderDate: Date = null;
  orderTime: Date = null;
  timestamp: number;
  isOwner: boolean = true;
  currency: string = 'USD';
  currencyExchange: number = null;
  isReceiptRemoved: boolean = false;
}