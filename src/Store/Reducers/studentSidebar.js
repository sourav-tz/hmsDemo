import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeOption:'Home',
  activeSubOption:'Home',
  state:false
}

export const studentSidebar = createSlice({
  name: 'studentSidebar',
  initialState,
  reducers: {
    setActiveOption:(state,action)=>{
        state.activeOption = action.payload;
    },
    setActiveSubOption:(state,action)=>{
        state.activeSubOption = action.payload;
    },
    openMenu:(state)=>{
      state.state = true;
    },
    closeMenu:(state)=>{
      state.state = false;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setActiveOption,setActiveSubOption,openMenu,closeMenu } = studentSidebar.actions;

export default studentSidebar.reducer;