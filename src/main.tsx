
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Clear any cached country data on application load
localStorage.removeItem('countries-cache');
console.log('🔍 MAIN: Cleared countries cache on application load');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
