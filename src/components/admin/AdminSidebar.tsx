
import React from 'react';
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

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
  className?: string; // Added className prop
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  collapsed, 
  onToggleCollapse,
  className
}) => {
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
      "fixed top-0 left-0 h-full flex flex-col bg-gradient-to-b from-primary-700 to-primary-800 border-r border-primary-900 transition-all duration-300 ease-in-out shadow-lg z-30",
      collapsed ? "w-16" : "w-64",
      className // Apply the optional className
    )}>
      <div className="flex items-center justify-between p-4 border-b border-primary-900">
        {!collapsed && (
          <span className="text-white text-xl font-bold">Yumvi-Pay Admin</span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-primary-800/50 rounded-full ml-auto"
          onClick={() => onToggleCollapse(!collapsed)}
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
                  ? 'bg-primary-800 text-white border-l-4 border-white/80'
                  : 'text-primary-100 hover:bg-primary-700/50 border-l-4 border-transparent',
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
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
      
      <div className="p-4 border-t border-primary-900 bg-primary-800/50">
        <div className={cn(
          "flex items-center", 
          collapsed ? "justify-center" : "space-x-3"
        )}>
          <div className="flex-shrink-0">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-100 to-primary-300 flex items-center justify-center text-primary-900 font-semibold shadow-md">
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
