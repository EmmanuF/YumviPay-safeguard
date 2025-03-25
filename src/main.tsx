import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.tsx';
import { CountriesProvider } from './hooks/useCountries.tsx';
import { RecipientsProvider } from './hooks/useRecipients.tsx';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

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
      <AuthProvider>
        <CountriesProvider>
          <RecipientsProvider>
            <App />
            <Toaster />
          </RecipientsProvider>
        </CountriesProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
