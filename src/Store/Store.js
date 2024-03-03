import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import userSlice from './Reducers/userSlice';
import loginSlice from './Reducers/loginSlice';
import sideBarSlice from './Reducers/sideBarSlice';
import viewInfoSlice from './Reducers/viewInfoSlice';
import superSidebarSlice from './Reducers/superSidebarSlice';
import uploadStudentSlice from './Reducers/uploadStudentSlice';
import studentSidebar from './Reducers/studentSidebar';
import roomSlice from './Reducers/roomSlice';


const persistConfig = {
  key: 'root',
  storage, // storage can be localStorage or sessionStorage
  whitelist: ['userStorage','sideBarStates','superSidebarSlice', 'studentSidebar'], // Add the slices you want to persist
};

const rootReducer =combineReducers({ 
  'loginStatus':loginSlice,
    'sideBarStates':sideBarSlice,
    'viewInfoStates':viewInfoSlice,
    'userStorage':userSlice,
    'superSideBarStates':superSidebarSlice,
    'uploadStudent':uploadStudentSlice,
    'StudentSidebar':studentSidebar,
    'haRoom':roomSlice

})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
})

export const persistor = persistStore(store)
