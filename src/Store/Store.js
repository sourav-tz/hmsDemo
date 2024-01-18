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




const persistConfig = {
  key: 'root',
  storage, // storage can be localStorage or sessionStorage
  whitelist: ['userStorage','sideBarStates'], // Add the slices you want to persist
};

const rootReducer =combineReducers({ 
  'loginStatus':loginSlice,
    'sideBarStates':sideBarSlice,
    'viewInfoStates':viewInfoSlice,
    'userStorage':userSlice
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
