import React from 'react';
import { NavLink } from 'react-router-dom';
import { Globe, Users, ShoppingCart, BarChart, FileText, Settings, Shield, ActivitySquare } from 'lucide-react';

const AdminSidebar = () => {
  return (
    <aside className="fixed left-0 top-0 z-20 h-full w-64 bg-white shadow-md dark:bg-gray-800 dark:border-gray-700 border-r">
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="flex items-center justify-center h-16 border-b dark:border-gray-700">
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Admin Panel
          </span>
        </div>
        
        <div className="px-3 py-2">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main
          </h2>
          <ul className="mt-2 space-y-1">
            <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <BarChart className="w-4 h-4 mr-2" />
                Dashboard
              </NavLink>
            </li>
          </ul>
        </div>
        
        <div className="px-3 py-2">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Management
          </h2>
          <ul className="mt-2 space-y-1">
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <Users className="w-4 h-4 mr-2" />
                Users
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/transactions"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Transactions
              </NavLink>
            </li>
          </ul>
        </div>
        
        <div className="px-3 py-2">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Content Management
          </h2>
          <ul className="mt-2 space-y-1">
            <li>
              <NavLink
                to="/admin/cms"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <FileText className="w-4 h-4 mr-2" />
                CMS
              </NavLink>
            </li>
            
            <li>
              <NavLink
                to="/admin/countries"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <Globe className="w-4 h-4 mr-2" />
                Countries
              </NavLink>
            </li>
          </ul>
        </div>
        
        <div className="px-3 py-2">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Analytics & Reporting
          </h2>
          <ul className="mt-2 space-y-1">
            <li>
              <NavLink
                to="/admin/analytics"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <BarChart className="w-4 h-4 mr-2" />
                Analytics
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/reports"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <FileText className="w-4 h-4 mr-2" />
                Reports
              </NavLink>
            </li>
          </ul>
        </div>
        
        <div className="px-3 py-2 mt-auto">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Utilities
          </h2>
          <ul className="mt-2 space-y-1">
            <li>
              <NavLink
                to="/admin/countries-status"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <ActivitySquare className="w-4 h-4 mr-2" />
                Country Status
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/security"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <Shield className="w-4 h-4 mr-2" />
                Security
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
