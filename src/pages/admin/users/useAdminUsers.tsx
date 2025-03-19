
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { getAdminUsers, updateUserStatus } from '@/services/admin/adminUserService';

export const useAdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: '', country: '' });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const { toast } = useToast();
  
  const {
    data: allUsers = [],
    isLoading,
    refetch,
    error
  } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getAdminUsers,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  
  // Apply filters
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = !filters.status || user.status === filters.status;
    const matchesCountry = !filters.country || user.country === filters.country;
    
    return matchesSearch && matchesStatus && matchesCountry;
  });
  
  // Handle timeout detection
  useEffect(() => {
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          setHasTimedOut(true);
          toast({
            title: "Request taking longer than expected",
            description: "The server might be under heavy load or experiencing issues.",
            variant: "destructive",
          });
        }
      }, 5000);
      
      return () => clearTimeout(timeoutId);
    } else {
      setHasTimedOut(false);
    }
  }, [isLoading, toast]);
  
  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Data refreshed",
        description: "User list has been updated with the latest data.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not refresh user data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch, toast]);
  
  // Handle adding a new user
  const handleAddUser = useCallback((userData) => {
    toast({
      title: "User Added",
      description: `${userData.name} has been added to the system.`,
    });
    // In a real implementation, we would call an API to add the user
    // and then refetch the user list
    setTimeout(() => refetch(), 500);
  }, [refetch, toast]);
  
  // Handle filter application
  const handleFilter = useCallback((newFilters) => {
    setFilters(newFilters);
    toast({
      title: "Filters Applied",
      description: "User list has been filtered based on your criteria.",
    });
  }, [toast]);
  
  // Clear search and filters
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setFilters({ status: '', country: '' });
  }, []);
  
  // Handle user status change
  const handleStatusChange = useCallback(async (userId, newStatus) => {
    try {
      const success = await updateUserStatus(userId, newStatus);
      
      if (success) {
        toast({
          title: "Status Updated",
          description: `User status has been changed to ${newStatus}.`,
          className: "bg-green-50 border-l-4 border-green-500",
        });
        
        // Refresh user list
        await refetch();
      } else {
        throw new Error("Status update failed");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the user status.",
        variant: "destructive",
      });
    }
  }, [refetch, toast]);
  
  return {
    users: filteredUsers,
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
    refetch,
    error
  };
};

export default useAdminUsers;
