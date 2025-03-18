
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, UserPlus, RefreshCw, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AdminUsersHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isRefreshing: boolean;
  handleRefresh: () => void;
}

const AdminUsersHeader: React.FC<AdminUsersHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  isRefreshing,
  handleRefresh
}) => {
  const { toast } = useToast();
  
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
  );
};

export default AdminUsersHeader;
