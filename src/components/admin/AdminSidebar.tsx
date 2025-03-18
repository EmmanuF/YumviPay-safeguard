
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
      "h-screen flex flex-col border-r bg-primary-900 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <span className="text-white text-xl font-bold">Yumvi-Pay Admin</span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-primary-800"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => cn(
                isActive
                  ? 'bg-primary-800 text-white'
                  : 'text-primary-100 hover:bg-primary-700',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
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
                  {!collapsed && <span>{item.name}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-primary-800">
        <div className={cn(
          "flex items-center", 
          collapsed ? "justify-center" : "space-x-3"
        )}>
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary-300 flex items-center justify-center text-primary-900 font-semibold">
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
