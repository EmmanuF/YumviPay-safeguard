
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserX } from 'lucide-react';

interface AdminUsersEmptyStateProps {
  searchTerm: string;
  clearSearch: () => void;
}

const AdminUsersEmptyState: React.FC<AdminUsersEmptyStateProps> = ({ 
  searchTerm, 
  clearSearch 
}) => {
  return (
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
            onClick={clearSearch}
            className="mx-auto"
          >
            Clear Search
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminUsersEmptyState;
