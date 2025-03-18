
import React, { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Loader2, MoreHorizontal, UserCheck, UserX, Edit, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  const [viewUserDialogOpen, setViewUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    country: '',
  });
  // Add state for tracking users with pending status changes
  const [pendingStatusChanges, setPendingStatusChanges] = useState<Record<string, boolean>>({});
  
  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setViewUserDialogOpen(true);
  };
  
  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setEditedUser({
      name: user.name,
      email: user.email,
      country: user.country,
    });
    setEditUserDialogOpen(true);
  };
  
  const saveUserChanges = () => {
    if (!selectedUser) return;
    
    toast({
      title: "User Updated",
      description: `Changes to ${editedUser.name} have been saved.`,
      className: "bg-green-50 border-l-4 border-green-500",
    });
    setEditUserDialogOpen(false);
  };
  
  // Improved function to handle status change with loading state
  const onStatusChange = async (userId: string, newStatus: string) => {
    try {
      // Set loading state for this user
      setPendingStatusChanges(prev => ({ ...prev, [userId]: true }));
      
      // Call the handler passed from parent
      await handleStatusChange(userId, newStatus);
      
    } catch (error) {
      console.error('Error in status change:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Clear loading state regardless of outcome
      setPendingStatusChanges(prev => ({ ...prev, [userId]: false }));
    }
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
                {pendingStatusChanges[user.id] ? (
                  <Button variant="ghost" size="sm" disabled className="hover:bg-gray-100">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </Button>
                ) : (
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
                        onClick={() => handleViewUser(user)}
                      >
                        <Eye className="mr-2 h-4 w-4 text-blue-600" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer flex items-center" 
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="mr-2 h-4 w-4 text-amber-600" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer flex items-center" 
                        onClick={() => onStatusChange(
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
                          onClick={() => onStatusChange(user.id, 'suspended')}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Suspend User
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-500">
        Showing {users.length} users
      </div>
      
      {/* View User Dialog */}
      <Dialog open={viewUserDialogOpen} onOpenChange={setViewUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-primary-700">User Details</DialogTitle>
            <DialogDescription>
              Detailed information about this user.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-5 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500 text-sm">Name</Label>
                  <p className="font-medium text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <Label className="text-gray-500 text-sm">Email</Label>
                  <p className="font-medium text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-gray-500 text-sm">Country</Label>
                  <p className="font-medium text-gray-900">{selectedUser.country}</p>
                </div>
                <div>
                  <Label className="text-gray-500 text-sm">Status</Label>
                  <p>{getStatusBadge(selectedUser.status)}</p>
                </div>
                <div>
                  <Label className="text-gray-500 text-sm">Registered On</Label>
                  <p className="font-medium text-gray-900">{formatDate(selectedUser.registered)}</p>
                </div>
                <div>
                  <Label className="text-gray-500 text-sm">User ID</Label>
                  <p className="font-medium text-gray-900 text-sm truncate">{selectedUser.id}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setViewUserDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to this user's information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input 
                id="edit-name" 
                value={editedUser.name}
                onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input 
                id="edit-email" 
                type="email"
                value={editedUser.email}
                onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-country">Country</Label>
              <Input 
                id="edit-country" 
                value={editedUser.country}
                onChange={(e) => setEditedUser({...editedUser, country: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveUserChanges}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersTable;
