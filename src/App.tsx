
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { NetworkProvider } from "@/contexts/NetworkContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { LocaleProvider } from "@/contexts/LocaleContext";

import ProtectedRoute from "@/components/ProtectedRoute";
import AppInitializer from "@/components/AppInitializer";

// Pages
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import SendMoney from "./pages/SendMoney";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import Recipients from "./pages/Recipients";
import Profile from "./pages/Profile";
import TransactionStatus from "./pages/TransactionStatus";
import TransactionDetails from "./pages/TransactionDetails";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NetworkProvider>
          <NotificationProvider>
            <LocaleProvider>
              <Router>
                <AppInitializer />
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/onboarding" element={<Onboarding />} />

                  {/* Protected routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/send"
                    element={
                      <ProtectedRoute>
                        <SendMoney />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      <ProtectedRoute>
                        <History />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/recipients"
                    element={
                      <ProtectedRoute>
                        <Recipients />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/transaction/:id"
                    element={
                      <ProtectedRoute>
                        <TransactionDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/transaction-status/:id"
                    element={
                      <ProtectedRoute>
                        <TransactionStatus />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </Router>
            </LocaleProvider>
          </NotificationProvider>
        </NetworkProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
