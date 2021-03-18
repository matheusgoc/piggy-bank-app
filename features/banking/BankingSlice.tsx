import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InstitutionModel } from '../../models/InstitutionModel';

export const BankingSlice = createSlice({
  name: 'banking',
  initialState: {
    institutions: [],
  },
  reducers: {
    addInstitution: (state, action: PayloadAction<InstitutionModel>) => {
      state.institutions.push(action.payload)
    },
    setInstitutions: (state, action: PayloadAction<InstitutionModel[]>) => {
      state.institutions = action.payload
    },
    removeInstitution: (state, action: PayloadAction<number>) => {
      let index = action.payload
      state.institutions.splice(index, 1)
    }
  },
});

//actions
export const { addInstitution, setInstitutions, removeInstitution } = BankingSlice.actions

//selectors
export const getInstitutions = state => state.banking.institutions

//reducer
export default BankingSlice.reducer
