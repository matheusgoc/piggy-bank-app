import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReportModel } from '../../models/ReportModel';

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
    }
  },
});

//actions
export const { setGeneralReport, setMonthlyReport } = ReportsSlice.actions;

//selectors
export const getGeneralReport = state => state.reports.general;
export const getMonthlyReport = state => state.reports.monthly;

//reducers
export default ReportsSlice.reducer;
