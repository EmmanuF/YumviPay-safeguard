
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  Home,
  CreditCard,
  ShieldAlert,
  Globe,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Transactions', href: '/admin/transactions', icon: CreditCard },
    { name: 'Countries', href: '/admin/countries', icon: Globe },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'Security', href: '/admin/security', icon: ShieldAlert },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className={cn(
      "h-screen flex flex-col bg-gradient-to-b from-primary-900 to-primary-800 transition-all duration-300 shadow-lg",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="flex items-center justify-between p-5 border-b border-primary-700">
        {!collapsed && (
          <span className="text-white text-xl font-bold bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">Yumvi-Pay Admin</span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-primary-700/50"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-2">
        <nav className="space-y-1.5">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => cn(
                isActive
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-primary-100 hover:bg-primary-700/50 hover:text-white',
                'group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors',
                collapsed ? 'justify-center' : 'justify-start'
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      isActive
                        ? 'text-white'
                        : 'text-primary-300 group-hover:text-white',
                      'flex-shrink-0 h-5 w-5',
                      collapsed ? 'mx-auto' : 'mr-3'
                    )}
                    aria-hidden="true"
                  />
                  {!collapsed && (
                    <span className="transition-opacity duration-200">{item.name}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-primary-700">
        <div className={cn(
          "flex items-center", 
          collapsed ? "justify-center" : "space-x-3"
        )}>
          <div className="flex-shrink-0">
            <div className="h-9 w-9 rounded-full bg-white/90 flex items-center justify-center text-primary-800 font-semibold shadow-sm">
              A
            </div>
          </div>
          {!collapsed && (
            <div className="text-sm text-white font-medium">
              Admin User
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
