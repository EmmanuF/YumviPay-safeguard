
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { AdminUsersHeader } from '@/components/admin/users';

interface TimeoutUIProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isRefreshing: boolean;
  handleRefresh: () => void;
  onAddUser: (userData: any) => void;
  onFilter: (filters: any) => void;
  refetch: () => void;
}

const TimeoutUI: React.FC<TimeoutUIProps> = ({
  searchTerm,
  setSearchTerm,
  isRefreshing,
  handleRefresh,
  onAddUser,
  onFilter,
  refetch
}) => {
  return (
    <div className="flex flex-col space-y-6 animate-slide-up">
      <AdminUsersHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isRefreshing={isRefreshing}
        handleRefresh={handleRefresh}
        onAddUser={onAddUser}
        onFilter={onFilter}
      />
      
      <Card className="shadow-md overflow-hidden">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Taking longer than expected to load data...
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="mb-4">The user data is taking a long time to load.</p>
          <Button onClick={() => refetch()} className="mr-2">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeoutUI;
