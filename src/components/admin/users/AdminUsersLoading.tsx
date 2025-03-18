
import React from 'react';
import { Loader2 } from 'lucide-react';

const AdminUsersLoading: React.FC = () => {
  return (
    <div className="flex justify-center py-12">
      <div className="text-center space-y-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Loading user data...</p>
      </div>
    </div>
  );
};

export default AdminUsersLoading;
