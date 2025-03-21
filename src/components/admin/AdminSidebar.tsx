
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Globe, CreditCard, 
  BarChart2, FileText, Settings, ShieldAlert, Menu, ChevronLeft 
} from 'lucide-react';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Globe, label: 'Countries', path: '/admin/countries' },
    { icon: CreditCard, label: 'Transactions', path: '/admin/transactions' },
    { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
    { icon: FileText, label: 'CMS', path: '/admin/cms' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
    { icon: ShieldAlert, label: 'Security', path: '/admin/security' },
  ];

  return (
    <aside className={`fixed top-0 left-0 h-full bg-white border-r transition-all duration-300 z-10 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <h2 className={`font-bold text-lg transition-opacity ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
          Admin Panel
        </h2>
        <button 
          onClick={() => onToggleCollapse(!collapsed)} 
          className="p-1 rounded-full hover:bg-gray-100"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="p-3">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <item.icon size={20} className="text-gray-600" />
                <span className={`ml-3 transition-opacity ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
