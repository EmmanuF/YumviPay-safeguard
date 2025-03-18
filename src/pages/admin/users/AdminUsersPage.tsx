
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminUsers } from './useAdminUsers';
import TimeoutUI from './TimeoutUI';
import AdminUsersContent from './AdminUsersContent';

const AdminUsersPage: React.FC = () => {
  const {
    users,
    searchTerm,
    setSearchTerm,
    isLoading,
    isRefreshing,
    hasTimedOut,
    handleStatusChange,
    handleRefresh,
    handleAddUser,
    handleFilter,
    clearSearch,
    refetch
  } = useAdminUsers();
  
  // Handle the timeout case
  if (hasTimedOut && isLoading) {
    return (
      <AdminLayout>
        <TimeoutUI
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isRefreshing={isRefreshing}
          handleRefresh={handleRefresh}
          onAddUser={handleAddUser}
          onFilter={handleFilter}
          refetch={refetch}
        />
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <AdminUsersContent
        users={users}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isRefreshing={isRefreshing}
        handleRefresh={handleRefresh}
        onAddUser={handleAddUser}
        onFilter={handleFilter}
        isLoading={isLoading}
        clearSearch={clearSearch}
        handleStatusChange={handleStatusChange}
      />
    </AdminLayout>
  );
};

export default AdminUsersPage;
