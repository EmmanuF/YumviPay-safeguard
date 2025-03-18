
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { getAdminUsers, updateUserStatus } from '@/services/admin/adminUserService';
import { 
  AdminUsersHeader, 
  AdminUsersTable, 
  AdminUsersEmptyState,
  AdminUsersLoading
} from '@/components/admin/users';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState({ status: '', country: '' });
  const { toast } = useToast();
  
  const { 
    data: users = [], 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getAdminUsers,
  });
  
  // Filter users based on search term and filter settings
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = !filters.status || user.status === filters.status;
    
    // Country filter
    const matchesCountry = !filters.country || user.country === filters.country;
    
    return matchesSearch && matchesStatus && matchesCountry;
  });
  
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const success = await updateUserStatus(userId, newStatus);
      
      if (success) {
        toast({
          title: "Status Updated",
          description: `User status has been changed to ${newStatus}`,
          variant: "default",
          className: "bg-primary-50 border-l-4 border-primary-500",
        });
        
        refetch();
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update user status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating the user status",
        variant: "destructive",
      });
    }
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    
    toast({
      title: "Data Refreshed",
      description: "User list has been updated",
      variant: "default",
      className: "bg-blue-50 border-l-4 border-blue-500",
    });
  };
  
  const handleAddUser = (userData: any) => {
    toast({
      title: "User Added",
      description: `${userData.name} has been added to the system.`,
      className: "bg-green-50 border-l-4 border-green-500",
    });
    // In a real implementation, we would add the user to the database
    // and then refetch the user list
    refetch();
  };
  
  const handleFilter = (filterData: any) => {
    setFilters(filterData);
    toast({
      title: "Filters Applied",
      description: "User list has been filtered according to your criteria.",
      className: "bg-blue-50 border-l-4 border-blue-500",
    });
  };
  
  const clearSearch = () => setSearchTerm('');
  
  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6 animate-slide-up">
        <AdminUsersHeader 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isRefreshing={isRefreshing}
          handleRefresh={handleRefresh}
          onAddUser={handleAddUser}
          onFilter={handleFilter}
        />
        
        <Card 
          gradient="purple"
          hoverEffect={true}
          className="shadow-md overflow-hidden"
        >
          <CardHeader className="bg-gradient-to-br from-primary-50 to-white border-b border-primary-100">
            <CardTitle className="text-primary-800">Users</CardTitle>
            <CardDescription>
              Manage your users, view their details, and update their status.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <AdminUsersLoading />
            ) : filteredUsers.length === 0 ? (
              <AdminUsersEmptyState 
                searchTerm={searchTerm} 
                clearSearch={clearSearch} 
              />
            ) : (
              <AdminUsersTable 
                users={filteredUsers} 
                handleStatusChange={handleStatusChange} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
