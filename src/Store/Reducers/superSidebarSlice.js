import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeOption:'Home',
  activeSubOption:'Home'
}

export const superSideBarSlice = createSlice({
  name: 'superSideBarStates',
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
export const { setActiveOption,setActiveSubOption } = superSideBarSlice.actions;

export default superSideBarSlice.reducer;