import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeOption:'Home',
  activeSubOption:'Home'
}

export const sideBarSlice = createSlice({
  name: 'sideBarStates',
  initialState,
  reducers: {
    setActiveOption:(state,action)=>{
        state.activeOption = action.payload;
    },
    setActiveSubOption:(state,action)=>{
        state.activeSubOption = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setActiveOption,setActiveSubOption } = sideBarSlice.actions;

export default sideBarSlice.reducer;