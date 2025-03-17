
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Settings, 
  BarChart2, 
  AlertTriangle, 
  Clock, 
  Database,
  Activity, 
  Shield,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { toast } from '@/hooks/use-toast';
import LoadingState from '@/components/transaction/LoadingState';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Admin = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the admin panel",
        variant: "destructive"
      });
      navigate('/signin', { state: { redirectTo: '/admin' } });
    }
  }, [isLoggedIn, loading, navigate]);
  
  // Simulate admin check
  useEffect(() => {
    if (user) {
      // In a real app, this would check against a database role
      // For now, we'll simulate a check based on the user's email
      setTimeout(() => {
        const adminCheck = user.email?.endsWith('@admin.com') || false;
        setIsAdmin(adminCheck);
        setCheckingAdmin(false);
        
        if (!adminCheck) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin panel",
            variant: "destructive"
          });
          navigate('/dashboard');
        }
      }, 1000);
    }
  }, [user, navigate]);
  
  if (loading || checkingAdmin) {
    return <LoadingState message="Verifying admin access..." submessage="Please wait" />;
  }
  
  if (!isAdmin) {
    return <LoadingState message="Access Denied" submessage="You don't have permission to view this page" />;
  }
  
  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={18} /> },
    { id: 'users', label: 'Users', icon: <Users size={18} /> },
    { id: 'transactions', label: 'Transactions', icon: <Activity size={18} /> },
    { id: 'monitoring', label: 'Monitoring', icon: <AlertTriangle size={18} /> },
    { id: 'reports', label: 'Reports', icon: <Clock size={18} /> },
    { id: 'database', label: 'Database', icon: <Database size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  ];
  
  return (
    <PageTransition>
      <div className="flex h-screen bg-gray-100">
        {/* Admin Sidebar */}
        <div className="w-64 bg-primary-800 text-white">
          <div className="p-4 border-b border-primary-700">
            <h1 className="text-xl font-bold">Yumvi-Pay Admin</h1>
          </div>
          
          <nav className="mt-6">
            <ul className="space-y-1">
              {adminNavItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm transition-colors ${
                      activeTab === item.id 
                        ? 'bg-primary-700 text-white' 
                        : 'text-primary-100 hover:bg-primary-700/50 hover:text-white'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
              
              <li className="mt-8">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center px-4 py-3 text-sm text-primary-100 hover:bg-primary-700/50 hover:text-white transition-colors"
                >
                  <span className="mr-3"><LogOut size={18} /></span>
                  Exit Admin Panel
                </button>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Admin Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-gray-600">Manage your application</p>
            </div>
            
            {/* Content area */}
            <div className="bg-white rounded-lg shadow p-6">
              {activeTab === 'dashboard' && <AdminDashboard />}
              {activeTab === 'users' && <div>Users Management - Coming Soon</div>}
              {activeTab === 'transactions' && <div>Transactions - Coming Soon</div>}
              {activeTab === 'monitoring' && <div>Monitoring - Coming Soon</div>}
              {activeTab === 'reports' && <div>Reports - Coming Soon</div>}
              {activeTab === 'database' && <div>Database - Coming Soon</div>}
              {activeTab === 'settings' && <div>Settings - Coming Soon</div>}
              {activeTab === 'security' && <div>Security - Coming Soon</div>}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Admin;
