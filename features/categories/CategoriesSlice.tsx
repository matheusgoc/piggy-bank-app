import { createSlice } from '@reduxjs/toolkit';

export const CategoriesSlice = createSlice({
  name: 'categories',
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
export const { setList, setListToSave, setListToRemove } = CategoriesSlice.actions;

//selectors
export const getList = state => state.categories.list;
export const getListToSave = state => state.categories.listToSave;
export const getListToRemove = state => state.categories.listToRemove;

//reducers
export default CategoriesSlice.reducer;
