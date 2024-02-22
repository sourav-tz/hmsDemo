import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {},
}

export const uploadStudentSlice = createSlice({
  name: 'userStorage',
  initialState,
  reducers: {
    setUpdateData:(state,action)=>{
        state.data = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUpdateData } = uploadStudentSlice.actions

export default uploadStudentSlice.reducer