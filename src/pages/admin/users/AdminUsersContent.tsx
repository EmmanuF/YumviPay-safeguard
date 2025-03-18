
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AdminUsersHeader, 
  AdminUsersTable, 
  AdminUsersEmptyState,
  AdminUsersLoading
} from '@/components/admin/users';
import { AdminUser } from '@/services/admin/adminUserService';

interface AdminUsersContentProps {
  users: AdminUser[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isRefreshing: boolean;
  handleRefresh: () => void;
  onAddUser: (userData: any) => void;
  onFilter: (filters: any) => void;
  isLoading: boolean;
  clearSearch: () => void;
  handleStatusChange: (userId: string, newStatus: string) => Promise<void>;
}

const AdminUsersContent: React.FC<AdminUsersContentProps> = ({
  users,
  searchTerm,
  setSearchTerm,
  isRefreshing,
  handleRefresh,
  onAddUser,
  onFilter,
  isLoading,
  clearSearch,
  handleStatusChange
}) => {
  return (
    <div className="flex flex-col space-y-6 animate-slide-up">
      <AdminUsersHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isRefreshing={isRefreshing}
        handleRefresh={handleRefresh}
        onAddUser={onAddUser}
        onFilter={onFilter}
      />
      
      <Card className="shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary-50 to-white border-b border-primary-100">
          <CardTitle className="text-primary-800">Users</CardTitle>
          <CardDescription>
            Manage your users, view their details, and update their status.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <AdminUsersLoading />
          ) : users.length === 0 ? (
            <AdminUsersEmptyState 
              searchTerm={searchTerm} 
              clearSearch={clearSearch} 
            />
          ) : (
            <AdminUsersTable 
              users={users} 
              handleStatusChange={handleStatusChange} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersContent;
