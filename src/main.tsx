
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.tsx';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { LocaleProvider } from './contexts/LocaleContext.tsx';
import { NotificationProvider } from './contexts/NotificationContext.tsx';
import { NetworkProvider } from './contexts/NetworkContext.tsx';
import { registerServiceWorker } from './utils/serviceWorker'; 

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

// Register service worker for offline capabilities
if (import.meta.env.PROD) {
  registerServiceWorker()
    .then(({ success }) => {
      if (success) {
        console.log('Service worker registered successfully');
      }
    })
    .catch(error => {
      console.error('Service worker registration failed:', error);
    });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider
      defaultTheme="system"
      storageKey="vite-react-theme"
    >
      <LocaleProvider>
        <AuthProvider>
          <NetworkProvider>
            <NotificationProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
              <Toaster />
            </NotificationProvider>
          </NetworkProvider>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
