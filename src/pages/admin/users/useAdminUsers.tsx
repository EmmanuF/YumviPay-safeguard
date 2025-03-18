
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { getAdminUsers, updateUserStatus } from '@/services/admin/adminUserService';

export interface UseAdminUsersOptions {
  initialSearchTerm?: string;
  initialFilters?: {
    status: string;
    country: string;
  };
}

export const useAdminUsers = (options: UseAdminUsersOptions = {}) => {
  const { initialSearchTerm = '', initialFilters = { status: '', country: '' } } = options;
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const { toast } = useToast();
  
  const { 
    data: users = [], 
    isLoading,
    isError,
    error,
    refetch 
  } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getAdminUsers,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  
  // Set a timeout to show fallback UI if the loading takes too long
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isLoading) {
      timeoutId = setTimeout(() => {
        setHasTimedOut(true);
      }, 10000); // 10 second timeout
    } else {
      setHasTimedOut(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);
  
  // Log any errors for debugging
  useEffect(() => {
    if (isError && error) {
      console.error('Error fetching admin users:', error);
    }
  }, [isError, error]);
  
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
    console.log(`Handling status change request for user ${userId} to ${newStatus}`);
    
    try {
      // Validate the status before proceeding
      if (!['active', 'inactive', 'suspended'].includes(newStatus)) {
        toast({
          title: "Invalid Status",
          description: "The requested status is not valid",
          variant: "destructive",
        });
        return;
      }
      
      const success = await updateUserStatus(userId, newStatus);
      
      if (success) {
        toast({
          title: "Status Updated",
          description: `User status has been changed to ${newStatus}`,
          variant: "default",
          className: "bg-primary-50 border-l-4 border-primary-500",
        });
        
        // Instead of immediately refetching, we'll first update the local data
        // to provide faster feedback to the user
        const updatedUsers = users.map(user => 
          user.id === userId ? { ...user, status: newStatus as any } : user
        );
        
        // Then refetch in the background
        refetch();
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update user status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in handleStatusChange:', error);
      toast({
        title: "Error",
        description: "An error occurred while updating the user status",
        variant: "destructive",
      });
    }
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      
      toast({
        title: "Data Refreshed",
        description: "User list has been updated",
        variant: "default",
        className: "bg-blue-50 border-l-4 border-blue-500",
      });
    } catch (err) {
      console.error('Error refreshing data:', err);
      toast({
        title: "Refresh Failed",
        description: "Could not refresh user data at this time",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
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

  return {
    users: filteredUsers,
    searchTerm,
    setSearchTerm,
    filters,
    isLoading,
    isRefreshing,
    hasTimedOut,
    handleStatusChange,
    handleRefresh,
    handleAddUser,
    handleFilter,
    clearSearch,
    refetch
  };
};
