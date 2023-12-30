import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './MainStyles/Fonts.scss';
import './MainStyles/Colors.scss';
import './MainStyles/global.scss';
import { BrowserRouter } from 'react-router-dom'
import { store } from  './Store/Store.js'
import { Provider } from 'react-redux'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <BrowserRouter>
  <Provider store={store}>
    <App />
    </Provider>
  </BrowserRouter>
  </React.StrictMode>,
)
