
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, UserPlus, RefreshCw, Search, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdminUsersHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isRefreshing: boolean;
  handleRefresh: () => void;
  onAddUser?: (userData: any) => void;
  onFilter?: (filters: any) => void;
}

const AdminUsersHeader: React.FC<AdminUsersHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  isRefreshing,
  handleRefresh,
  onAddUser,
  onFilter
}) => {
  const { toast } = useToast();
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    country: 'Cameroon',
  });
  const [filters, setFilters] = useState({
    status: '',
    country: '',
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (onAddUser) {
      onAddUser(newUser);
    } else {
      toast({
        title: "User Added",
        description: `${newUser.name} has been added to the system.`,
        className: "bg-green-50 border-l-4 border-green-500",
      });
    }
    
    setNewUser({ name: '', email: '', country: 'Cameroon' });
    setAddUserDialogOpen(false);
  };

  const handleFilter = () => {
    if (onFilter) {
      onFilter(filters);
    } else {
      toast({
        title: "Filters Applied",
        description: "User list has been filtered.",
        className: "bg-blue-50 border-l-4 border-blue-500",
      });
    }
    setFilterOpen(false);
  };

  const resetFilter = () => {
    setFilters({ status: '', country: '' });
    if (onFilter) {
      onFilter({ status: '', country: '' });
    }
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared.",
    });
    setFilterOpen(false);
  };
  
  return (
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
        
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="border-primary-200 hover:bg-primary-50"
            >
              <Filter className="h-4 w-4 text-primary-600" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Filter Users</h3>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={filters.status} 
                  onValueChange={(value) => setFilters({...filters, status: value})}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select 
                  value={filters.country} 
                  onValueChange={(value) => setFilters({...filters, country: value})}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Countries</SelectItem>
                    <SelectItem value="Cameroon">Cameroon</SelectItem>
                    <SelectItem value="Nigeria">Nigeria</SelectItem>
                    <SelectItem value="Ghana">Ghana</SelectItem>
                    <SelectItem value="Kenya">Kenya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={resetFilter}>
                  Reset
                </Button>
                <Button size="sm" onClick={handleFilter}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button 
          onClick={handleRefresh} 
          variant="outline"
          className="border-blue-200 hover:bg-blue-50"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 text-blue-600 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
        
        <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
          <Button 
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
            onClick={() => setAddUserDialogOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
          
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Enter the details for a new user. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter user's full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="Enter user's email address"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select 
                  value={newUser.country} 
                  onValueChange={(value) => setNewUser({...newUser, country: value})}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cameroon">Cameroon</SelectItem>
                    <SelectItem value="Nigeria">Nigeria</SelectItem>
                    <SelectItem value="Ghana">Ghana</SelectItem>
                    <SelectItem value="Kenya">Kenya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminUsersHeader;
