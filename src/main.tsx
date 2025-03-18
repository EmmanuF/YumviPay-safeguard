
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { NotificationProvider } from '@/contexts/NotificationContext'
import './index.css'
import './styles/layout.css'
import './styles/print.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <App />
        <Toaster />
      </NotificationProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
