import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReportModel } from '../../models/ReportModel';
import { TransactionModel } from '../../models/TransactionModel';
import { CategoryModel } from '../../models/CategoryModel';

export const ReportsSlice = createSlice({
  name: 'reports',
  initialState: {
    general: ReportModel,
    monthly: ReportModel,
  },
  reducers: {
    setGeneralReport: (state, action) => {
      state.general = action.payload;
    },
    setMonthlyReport: (state, action) => {
      state.monthly = action.payload;
    },
    updateReport: (state, action: PayloadAction<{
      transaction: TransactionModel,
      hasMonthly: boolean,
      operator: 'add'|'sub',
    }>) => {
      const {transaction, operator, hasMonthly} = action.payload;
      const type = (transaction.type == 'I')? 'incomes': 'expenses';
      const amount = Math.abs(transaction.amount);
      const category = transaction.category.name;
      const reports = (hasMonthly)? ['general', 'monthly'] : ['general'];
      console.log(operator,type,amount,category,reports,transaction,hasMonthly);
      for (const report of reports) {
        if (operator == 'sub') {
          state[report][type] -= amount;
          if (state[report]['categories'][type][category] == amount) {
            delete state[report]['categories'][type][category];
          } else {
            state[report]['categories'][type][category] -= amount;
          }
        } else {
          state[report][type] += amount;
          if (state[report]['categories'][type][category]) {
            state[report]['categories'][type][category] += amount;
          } else {
            state[report]['categories'][type][category] = amount;
          }
        }
      }
    },
  }
  ,
});

//actions
export const { setGeneralReport, setMonthlyReport, updateReport } = ReportsSlice.actions;

//selectors
export const getGeneralReport = state => state.reports.general;
export const getMonthlyReport = state => state.reports.monthly;

//reducers
export default ReportsSlice.reducer;
