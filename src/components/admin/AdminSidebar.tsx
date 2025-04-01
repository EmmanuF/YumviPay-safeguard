
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  Flag, 
  Image, 
  Palette,
  Database 
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/admin'
    },
    {
      title: 'Content',
      icon: <FileText className="w-5 h-5" />,
      path: '/admin/content'
    },
    {
      title: 'Media',
      icon: <Image className="w-5 h-5" />,
      path: '/admin/media'
    },
    {
      title: 'UI Components',
      icon: <Palette className="w-5 h-5" />,
      path: '/admin/ui-components'
    },
    {
      title: 'Feature Flags',
      icon: <Flag className="w-5 h-5" />,
      path: '/admin/feature-flags'
    },
    {
      title: 'Users',
      icon: <Users className="w-5 h-5" />,
      path: '/admin/users'
    },
    {
      title: 'Data Explorer',
      icon: <Database className="w-5 h-5" />,
      path: '/admin/data'
    },
    {
      title: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/admin/settings'
    }
  ];

  return (
    <div className="w-64 bg-indigo-900 text-white h-screen sticky top-0 shadow-lg">
      <div className="p-4 border-b border-indigo-800">
        <h1 className="text-xl font-bold">Yumvi-Pay Admin</h1>
      </div>
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className="mb-1 px-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-800'
                  }`
                }
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
