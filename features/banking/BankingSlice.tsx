import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InstitutionModel } from '../../models/InstitutionModel';

export const BankingSlice = createSlice({
  name: 'banking',
  initialState: {
    institutions: [],
    index: null,
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
    },
    setInstitutionIndex: (state, action: PayloadAction<number>) => {
      state.index = action.payload
    }
  },
});

//actions
export const { addInstitution, setInstitutions, removeInstitution, setInstitutionIndex } = BankingSlice.actions

//selectors
export const getInstitutions = state => state.banking.institutions
export const getInstitutionIndex = state => state.banking.index

//reducer
export default BankingSlice.reducer
