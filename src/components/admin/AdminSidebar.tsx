
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
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
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
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow bg-primary-900 pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <span className="text-white text-xl font-bold">Yumvi-Pay Admin</span>
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => cn(
                  isActive
                    ? 'bg-primary-800 text-white'
                    : 'text-primary-100 hover:bg-primary-700',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn(
                        isActive
                          ? 'text-white'
                          : 'text-primary-300 group-hover:text-white',
                        'mr-3 flex-shrink-0 h-5 w-5'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
