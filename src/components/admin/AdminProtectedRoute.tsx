
import React from 'react';

export interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  // For now, we'll just show the admin UI without authentication
  // In a real app, we would check if the user is authenticated and has admin privileges
  return <>{children}</>;
};

export default AdminProtectedRoute;
