import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: false,
}

export const loginSlice = createSlice({
  name: 'loginStatus',
  initialState,
  reducers: {
    changeLoginStatus:(state,action)=>{
        state.isLoggedIn = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { changeLoginStatus } = loginSlice.actions

export default loginSlice.reducer