
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { MoreHorizontal, UserCheck, UserX } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { formatDate } from '@/utils/formatUtils';
import { AdminUser } from '@/services/admin/adminUserService';

interface AdminUsersTableProps {
  users: AdminUser[];
  handleStatusChange: (userId: string, newStatus: string) => Promise<void>;
}

const AdminUsersTable: React.FC<AdminUsersTableProps> = ({ 
  users,
  handleStatusChange 
}) => {
  const { toast } = useToast();
  
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
          {users.map((user) => (
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
        Showing {users.length} users
      </div>
    </div>
  );
};

export default AdminUsersTable;
