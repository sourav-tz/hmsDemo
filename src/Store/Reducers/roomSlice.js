import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  allot: false,
  view:false,
}

export const roomSlice = createSlice({
  name: 'roomSlice',
  initialState,
  reducers: {
    setAllot:(state,action)=>{
        state.allot = action.payload;
    },
    setView:(state,action)=>{
        state.view = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setAllot,setView } = roomSlice.actions

export default roomSlice.reducer