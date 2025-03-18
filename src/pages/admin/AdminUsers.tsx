
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Search, 
  Filter, 
  UserPlus, 
  MoreHorizontal,
  UserCheck,
  UserX,
  RefreshCw 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import AdminLayout from '@/components/admin/AdminLayout';
import { getAdminUsers, updateUserStatus } from '@/services/admin/adminUserService';
import { formatDate } from '@/utils/formatUtils';
import { useToast } from '@/components/ui/use-toast';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  const { 
    data: users = [], 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getAdminUsers,
  });
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-gray-500 border-gray-300">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6 animate-slide-up">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-primary-800">User Management</h1>
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-grow max-w-[250px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className="border-primary-200 hover:bg-primary-50"
              onClick={() => toast({ 
                title: "Filters", 
                description: "Filter functionality coming soon!" 
              })}
            >
              <Filter className="h-4 w-4 text-primary-600" />
            </Button>
            <Button 
              onClick={handleRefresh} 
              variant="outline"
              className="border-blue-200 hover:bg-blue-50"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 text-blue-600 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>
        
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
              <div className="flex justify-center py-12">
                <div className="text-center space-y-3">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                  <p className="text-muted-foreground">Loading user data...</p>
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 px-6">
                <div className="max-w-md mx-auto">
                  <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
                  <p className="text-muted-foreground mb-4">
                    No users matching your search criteria were found.
                  </p>
                  {searchTerm && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchTerm('')}
                      className="mx-auto"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Country</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Registered</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium text-primary-700">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.country}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="text-gray-600">{formatDate(user.registered)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 shadow-lg">
                              <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="cursor-pointer flex items-center" 
                                onClick={() => toast({ 
                                  title: "View User", 
                                  description: "User details view not implemented yet" 
                                })}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer flex items-center" 
                                onClick={() => toast({ 
                                  title: "Edit User", 
                                  description: "User edit not implemented yet" 
                                })}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer flex items-center" 
                                onClick={() => handleStatusChange(
                                  user.id, 
                                  user.status === 'active' ? 'inactive' : 'active'
                                )}
                              >
                                {user.status === 'active' 
                                  ? <UserX className="mr-2 h-4 w-4 text-gray-600" /> 
                                  : <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                                }
                                Set {user.status === 'active' ? 'Inactive' : 'Active'}
                              </DropdownMenuItem>
                              {user.status !== 'suspended' && (
                                <DropdownMenuItem 
                                  className="cursor-pointer flex items-center text-red-600 hover:text-red-700 hover:bg-red-50" 
                                  onClick={() => handleStatusChange(user.id, 'suspended')}
                                >
                                  <UserX className="mr-2 h-4 w-4" />
                                  Suspend User
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="p-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-500">
                  Showing {filteredUsers.length} of {users.length} users
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
