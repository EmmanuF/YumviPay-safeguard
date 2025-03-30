
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.tsx';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { LocaleProvider } from './contexts/LocaleContext.tsx';
import { NotificationProvider } from './contexts/NotificationContext.tsx';

// Make transaction data retrieval functions globally available for emergency access
import { getTransactionAmount, getTransactionData } from './utils/transactionDataStore';

// Attach to window for emergency access
declare global {
  interface Window {
    getTransactionAmount: typeof getTransactionAmount;
    getTransactionData: typeof getTransactionData;
  }
}

window.getTransactionAmount = getTransactionAmount;
window.getTransactionData = getTransactionData;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider
      defaultTheme="system"
      storageKey="vite-react-theme"
    >
      <LocaleProvider>
        <AuthProvider>
          <NotificationProvider>
            <App />
            <Toaster />
          </NotificationProvider>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
