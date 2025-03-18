
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
import { Loader2, Search, Filter, UserPlus } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

// Mock user data
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', country: 'US', status: 'active', registered: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', country: 'CM', status: 'active', registered: '2023-02-20' },
  { id: 3, name: 'Robert Johnson', email: 'robert@example.com', country: 'NG', status: 'inactive', registered: '2023-03-05' },
  { id: 4, name: 'Maria Garcia', email: 'maria@example.com', country: 'CM', status: 'active', registered: '2023-03-12' },
  { id: 5, name: 'David Brown', email: 'david@example.com', country: 'GH', status: 'suspended', registered: '2023-04-08' },
  { id: 6, name: 'Lisa Wilson', email: 'lisa@example.com', country: 'CM', status: 'active', registered: '2023-04-18' },
  { id: 7, name: 'Michael Taylor', email: 'michael@example.com', country: 'US', status: 'active', registered: '2023-05-01' },
  { id: 8, name: 'Sarah Martinez', email: 'sarah@example.com', country: 'CM', status: 'inactive', registered: '2023-05-15' },
];

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // This will be replaced with actual API call
  const { data: users = mockUsers, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      // Placeholder for actual API call
      return mockUsers;
    },
  });
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-gray-500">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage your users, view their details, and update their status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.country}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{new Date(user.registered).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
