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
import viewInfoSlice from './Reducers/viewInfoSlice';
import uploadStudentSlice from './Reducers/uploadStudentSlice';
import roomSlice from './Reducers/roomSlice';


const persistConfig = {
  key: 'root',
  storage, // storage can be localStorage or sessionStorage
  whitelist: ['userStorage'], // Add the slices you want to persist
};

const rootReducer =combineReducers({ 
    'viewInfoStates':viewInfoSlice,
    'userStorage':userSlice,
    'uploadStudent':uploadStudentSlice,
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
