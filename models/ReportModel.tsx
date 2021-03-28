import { string } from 'prop-types';

export class ReportModel {
  incomes: number = 0;
  expenses: number = 0;
  categories = {
    incomes: {},
    expenses: {},
  }
}