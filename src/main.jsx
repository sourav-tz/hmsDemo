import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './MainStyles/Fonts.scss';
import './MainStyles/Colors.scss';
import './MainStyles/global.scss';
import { BrowserRouter } from 'react-router-dom'
import { store,persistor } from  './Store/Store.js'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Loadingpage from './components/Loadingpage/Loadingpage.jsx';
import './index.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <BrowserRouter>
  <Provider store={store}>
  <PersistGate loading={<Loadingpage />} persistor={persistor}>
    <App />
    </PersistGate>
    </Provider>
  </BrowserRouter>
  </React.StrictMode>,
)
