import { createSlice } from '@reduxjs/toolkit';

export const TransactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    list: [],
    listToSave: [],
    listToRemove: [],
  },
  reducers: {
    setList: (state, action) => {
      state.list = action.payload;
    },
    setListToSave: (state, action) => {
      state.listToSave = action.payload;
    },
    setListToRemove: (state, action) => {
      state.listToRemove = action.payload;
    },
  },
});

//actions
export const { setList, setListToSave, setListToRemove } = TransactionsSlice.actions;

//selectors
export const getList = state => state?.transactions?.list;
export const getListToSave = state => state?.transactions?.listToSave;
export const getListToRemove = state => state?.transactions?.listToRemove;

//reducers
export default TransactionsSlice.reducer;
