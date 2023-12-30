import { configureStore } from '@reduxjs/toolkit'
import loginSlice from './Reducers/loginSlice';
import sideBarSlice from './Reducers/sideBarSlice';
export const store = configureStore({
  reducer: {
    'loginStatus':loginSlice,
    'sideBarStates':sideBarSlice,
  },
})