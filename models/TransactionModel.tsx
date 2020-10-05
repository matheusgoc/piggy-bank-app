import { CategoryModel } from './CategoryModel';

export class TransactionModel {
  id: number = null;
  key: string;
  type: 'I'|'E' = 'E';
  category: CategoryModel = { id: null, name: '', isNew: false }
  amount: number = null;
  place: string = '';
  description: string = '';
  receipt: string = '';
  isNewReceipt: boolean = false;
  orderDate: Date = new Date();
  orderTime: Date = null;
  timestamp: number;
  isOwner: boolean = true;
  currency: string = 'USD';
  currencyExchange: number = null;
  isReceiptRemoved: boolean = false;
}