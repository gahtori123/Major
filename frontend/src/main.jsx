import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import store from './store/Store.js'
import { Toaster } from 'react-hot-toast'
import { GoogleLogin } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
    </Provider>
  </>
)
