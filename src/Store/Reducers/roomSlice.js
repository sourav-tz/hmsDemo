import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  allot: false,
  view:false,
  allotData:{roomNo:null,rollNo:null,hostelNo:null},
  roomData:{},
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
    },
    setAllotData:(state,action)=>{
      state.allotData = action.payload;
    },
    setRoomData:(state,action)=>{
      state.roomData = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setAllot,setView,setAllotData,setRoomData } = roomSlice.actions

export default roomSlice.reducer