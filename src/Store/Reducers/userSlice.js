import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {},
}

export const userSlice = createSlice({
  name: 'userStorage',
  initialState,
  reducers: {
    setUserData:(state,action)=>{
        state.data = action.payload;
    },
    removeUserData:(state)=>{
      state.data={};
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUserData,removeUserData } = userSlice.actions

export default userSlice.reducer